import Transaction from "../models/TransactionModel.js";
import Table from "../models/TableModel.js";
import { Op } from "sequelize";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import axios from "axios";
dotenv.config();

const espIp = "http://192.168.1.36";

export const turnOffLamp = async (io) => {
    try {
        const now = new Date();
        const transactions = await Transaction.findAll({
            where: {
                time_end: { [Op.lte]: now },
                is_active: true,
            },
        });

        for (const transaction of transactions) {
            const table = await Table.findOne({
                where: { id: transaction.id_billiard },
                raw: true
            });

            if (!table) continue;

            try {
                await axios.post(`${espIp}/turnOffLamp`, table.led_pin.toString(), {
                    headers: { "Content-Type": "text/plain" },
                    timeout: 1000,
                });
            } catch (error) {
                console.warn(
                    `ESP32 tidak merespons dalam 1 detik untuk ${table.table_name}. Melanjutkan proses...`
                );
            }

            await Table.update({ is_lamp_on: 0 }, { where: { id: transaction.id_billiard } });
            await Transaction.update({ is_active: false }, { where: { id: transaction.id } });

            const updatedTable = await Table.findOne({ where: { id: transaction.id_billiard }, raw: true });
            io.emit("tableUpdated", updatedTable);
        }
    } catch (error) {
        console.error("Error turning off lamp:", error);
    }
};

export const getTransaction = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id_user = decoded.id;

        const response = await Transaction.findAll({
            where: { id_user },
            include: [
                {
                    model: Table,
                    as: "Table",
                    attributes: ["id", "table_name"],
                },
            ],
        });

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const transSocketEvents = (io) => {
    io.on("connection", (socket) => {
        socket.on("addTransaction", async (data) => {
            try {
                const table = await Table.findOne({
                    where: { id: data.id_billiard },
                });

                if (table.is_lamp_on === 1) {
                    socket.emit("transactionError", "Meja sedang digunakan, tidak bisa menambahkan transaksi baru!");
                    return;
                }

                const now = new Date();
                const date = now.toISOString().split("T")[0];
                const time_start = now;
                const time_end = new Date(now.getTime() + data.duration * 60 * 60 * 1000);
                const total_price = data.duration * 25000;

                const newTransaction = await Transaction.create({
                    ...data,
                    time_start,
                    time_end,
                    date,
                    total_price,
                    is_active: true,
                });

                await Transaction.update(
                    { is_active: false },
                    {
                        where: {
                            id_billiard: data.id_billiard,
                            id: { [Op.ne]: newTransaction.id },
                        },
                    }
                );

                await Table.update({ is_lamp_on: 1 }, { where: { id: data.id_billiard } });

                try {
                    await axios.post(`${espIp}/turnOffLamp`, table.led_pin.toString(), {
                        headers: { "Content-Type": "text/plain" },
                        timeout: 1000,
                    });
                } catch (error) {
                    console.warn(
                        `ESP32 tidak merespons dalam 1 detik untuk ${table.table_name}. Melanjutkan proses...`
                    );
                }

                const updatedTable = await Table.findOne({
                    where: { id: data.id_billiard },
                });

                io.emit("tableUpdated", updatedTable);
                io.emit("transactionCreated", newTransaction);
            } catch (error) {
                console.error("Error adding transaction:", error);
                socket.emit("transactionError", "Terjadi kesalahan saat menambahkan transaksi.");
            }
        });


        socket.on("endSession", async (data) => {
            try {
                const now = new Date();
                const { id } = data;

                const [affectedRows] = await Transaction.update(
                    { time_end: now },
                    { where: { id } }
                );

                if (affectedRows === 0) {
                    console.error("Transaction not found");
                    return;
                }

                const updatedTransaction = await Transaction.findOne({ where: { id } });

                io.emit("transactionUpdated", {
                    id: updatedTransaction.id,
                    id_billiard: updatedTransaction.id_billiard,
                    time_end: updatedTransaction.time_end,
                });

            } catch (error) {
                console.error("Error ending session:", error);
            }
        });


        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};