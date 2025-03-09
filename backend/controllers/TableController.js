import Table from "../models/TableModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
dotenv.config();

export const getTables = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id_user = decoded.id;

        const searchQuery = req.query.search ? req.query.search.trim() : "";
        const roleFilter = req.query.role || "";
        const priceFilter = req.query.price ? parseInt(req.query.price) : null;

        let whereCondition = { id_user };

        if (searchQuery) {
            const parsedNumber = parseInt(searchQuery);
            const isNumber = !isNaN(parsedNumber);

            whereCondition = {
                ...whereCondition,
                [Op.or]: [
                    ...(isNumber ? [
                        { table_condition: parsedNumber },
                        { led_pin: parsedNumber }
                    ] : []),
                    { table_name: { [Op.iLike]: `%${searchQuery}%` } },
                    { role: { [Op.iLike]: `%${searchQuery}%` } }
                ]
            };
        }


        if (roleFilter) {
            whereCondition = {
                ...whereCondition,
                role: roleFilter
            };
        }

        if (priceFilter) {
            whereCondition = {
                ...whereCondition,
                price: priceFilter
            };
        }

        const response = await Table.findAll({ where: whereCondition });

        res.status(200).json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const deleteTable = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRows = await Table.destroy({
            where: {
                id: id
            }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: "Table not found" });
        }

        res.status(200).json({ message: "Table deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editTable = async (req, res) => {
    const { id } = req.params;
    const { table_name, price, led_pin } = req.body;

    try {
        const table = await Table.findByPk(id);
        if (!table) {
            return res.status(404).json({ message: "Table not found" });
        }

        const [updatedRows] = await Table.update(
            { table_name, price, led_pin },
            { where: { id } }
        );

        if (updatedRows === 0) {
            return res.status(400).json({ message: "No changes made" });
        }

        const updatedTable = await Table.findByPk(id);

        res.status(200).json({
            success: true,
            message: "Table updated successfully",
            data: updatedTable,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};


export const addTable = async (req, res) => {
    try {
        await Table.create(req.body);
        res.status(201).json({ msg: 'Table Created' });
    } catch (error) {
        console.log(error.message);
    }
};

export const countTable = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await Table.count({
            where: {
                id_user: id
            }
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const countOnlineTable = async (req, res) => {
    const { id } = req.params;

    try {
        const count = await Table.count({
            where: {
                id_user: id,
                is_lamp_on: 1
            }
        });

        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const countTableThisMonth = async (req, res) => {
    const { id } = req.params;

    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const count = await Table.count({
            where: {
                id_user: id,
                createdAt: {
                    [Op.gte]: startOfMonth,
                    [Op.lte]: endOfMonth
                }
            }
        });

        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const handleSocketEvents = (io) => {
    io.on("connection", (socket) => {
        socket.on("updateTable", async (data) => {
            try {
                const { id, x, y, width, height, rotation } = data;
                const table = await Table.findByPk(id);

                if (table) {
                    await table.update({ x, y, width, height, rotation });
                    const updatedTable = await Table.findByPk(id);

                    io.emit("tableUpdated", updatedTable);
                } else {
                    console.log(`Table with ID ${id} not found.`);
                }
            } catch (error) {
                console.error("Error updating table:", error);
            }
        });

        socket.on("updateAllTable", async (data) => {
            try {
                const { id_user, role, width, height, rotation } = data;

                const tables = await Table.findAll({
                    where: {
                        id_user: id_user,
                        role: role
                    }
                });

                if (tables && tables.length > 0) {
                    await Promise.all(
                        tables.map(async (table) => {
                            const updatedTable = await table.update({ width, height, rotation });

                            io.emit("tableUpdated", updatedTable);
                        }),
                    );
                }

            } catch (error) {
                console.error("Error updating all tables:", error);
            }
        });

        socket.on("addTable", async (data) => {
            try {
                const tables = await Table.findAll({
                    where: { id_user: data.id_user },
                    order: [["table_name", "ASC"]],
                    attributes: ["table_name"],
                });

                const tableNumbers = tables
                    .map((t) => {
                        const match = t.table_name.match(/^Table #(\d+)$/);
                        return match ? parseInt(match[1], 10) : null;
                    })
                    .filter(Number.isInteger)
                    .sort((a, b) => a - b);

                let newTableNumber = 1;
                for (const num of tableNumbers) {
                    if (num === newTableNumber) {
                        newTableNumber++;
                    } else {
                        break;
                    }
                }

                const table_name = `Table #${newTableNumber}`;

                const newTable = await Table.create({ ...data, table_name });

                io.emit("tableAdded", newTable);
            } catch (error) {
                console.error("Error adding table:", error);
            }
        });


        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};