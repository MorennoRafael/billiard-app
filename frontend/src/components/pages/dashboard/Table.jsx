import { useEffect, useState } from "react";
import NavigationButton from "../../button/NavigationButton";
import { IoClose, IoSettingsOutline, IoSettings } from "react-icons/io5";
import { GiEntryDoor } from "react-icons/gi";
import interact from "interactjs";
import { io } from "socket.io-client";
import DialogTransaction from "./DialogTransaction";
import DialogEnd from "./DialogEnd";
import DialogEditTable from "./DialogEditTable";
import { MdRotateLeft } from "react-icons/md";
import FormTableReg from "./FormTableReg";
import FormTableVip from "./FormTableVip";
import InformationDetail from "./InformationDetail";

const socket = io("http://localhost:4000");

export default function Table() {
    const [tables, setTables] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [openReg, setOpenReg] = useState(false);
    const [openVip, setOpenVip] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [remainingTime, setRemainingTime] = useState("00:00:00");
    const [isLampOn, setIsLampOn] = useState(false);
    const [isDialoEditOpen, setIsDialogEditOpen] = useState(false);

    const calculateRemainingTime = (timeEnd) => {
        if (!timeEnd) {
            return "00:00:00";
        }

        const now = new Date();
        const endTime = new Date(timeEnd);

        if (isNaN(endTime.getTime())) {
            return "00:00:00";
        }

        const difference = endTime - now;

        if (difference <= 0) {
            return "00:00:00";
        }

        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    useEffect(() => {
        fetch("http://localhost:4000/transaction", {
            method: "GET",
            credentials: "include"
        })
            .then((res) => res.json())
            .then((data) => {
                setTransactions(data);
            })
            .catch((error) => {
                console.error("Error fetching transactions:", error);
                setTransactions([]);
            });

        socket.on("transactionCreated", (newTransaction) => {
            setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
        });

        socket.on("transactionUpdated", (updatedTransaction) => {
            setTransactions((prevTransactions) =>
                prevTransactions.map((transaction) =>
                    transaction.id === updatedTransaction.id
                        ? { ...transaction, time_end: updatedTransaction.time_end }
                        : transaction
                )
            );

            if (selectedTable === updatedTransaction.id_billiard) {
                setRemainingTime("00:00:00");
            }

            if (selectedTransaction === updatedTransaction.id) {
                setSelectedTransaction(null);
            }
        });

        return () => {
            socket.off("transactionCreated");
            socket.off("transactionUpdated");
        };
    }, [selectedTable, selectedTransaction]);

    useEffect(() => {
        if (!selectedTable) {
            setRemainingTime("00:00:00");
            return;
        }

        const activeTransaction = transactions.find(
            (transaction) => transaction.id_billiard === selectedTable && transaction.is_active === true
        );

        if (!activeTransaction || !activeTransaction.time_end) {
            setRemainingTime("00:00:00");
            return;
        }

        const timer = setInterval(() => {
            const time = calculateRemainingTime(activeTransaction.time_end);
            setRemainingTime(time);
        }, 1000);

        return () => clearInterval(timer);
    }, [selectedTable, transactions]);

    useEffect(() => {
        fetch("http://localhost:4000/tables", {
            method: "GET",
            credentials: "include"
        })
            .then((res) => res.json())
            .then(setTables)
            .catch((error) => {
                console.error("Error fetching tables:", error);
                setTables([]);
            });

        socket.on("tableUpdated", (updatedTable) => {
            setTables((prevTables) =>
                prevTables.map((table) =>
                    table.id === updatedTable.id ? { ...table, ...updatedTable } : table
                )
            );

            if (selectedTable === updatedTable.id) {
                setIsLampOn(updatedTable.is_lamp_on);
            }
        });

        socket.on("tableAdded", (newTable) => {
            setTables((prevTables) => [...prevTables, newTable]);
        });

        return () => {
            socket.off("tableUpdated");
            socket.off("tableAdded");
        };
    }, [selectedTable]);

    useEffect(() => {
        interact(".shape").draggable({
            inertia: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: "parent",
                    endOnly: true,
                }),
            ],
            listeners: {
                move(event) {
                    const target = event.target;
                    const id = parseInt(target.dataset.id);

                    let x = Math.round((parseFloat(target.dataset.x) || 0) + event.dx);
                    let y = Math.round((parseFloat(target.dataset.y) || 0) + event.dy);
                    let rotation = parseFloat(target.dataset.rotation) || 0;

                    requestAnimationFrame(() => {
                        target.dataset.x = x;
                        target.dataset.y = y;
                        target.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
                    });

                    socket.emit("updateTable", { id, x, y });
                },
            },
        });

        interact(".shape").resizable({
            edges: { left: true, right: true, top: true, bottom: true },
            listeners: {
                move(event) {
                    const target = event.target;
                    const id = parseInt(target.dataset.id);

                    let { width, height } = event.rect;

                    requestAnimationFrame(() => {
                        target.style.width = `${width}px`;
                        target.style.height = `${height}px`;
                    });

                    target.dataset.width = width;
                    target.dataset.height = height;

                    socket.emit("updateTable", { id, width, height });
                },
            },
        });

        return () => {
            interact(".shape").unset();
        };
    }, []);

    const addTable = (type) => {
        fetch("http://localhost:4000/user", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                const userId = data.response[0].id;

                if (!userId) {
                    alert("User tidak ditemukan!");
                    return;
                }

                const newTable = {
                    id_user: userId,
                    x: 50,
                    y: 50,
                    width: 100,
                    height: 50,
                    rotation: 0,
                    role: type,
                    price: type === "vip" ? 50000 : 30000,
                    table_condition: 0,
                    is_lamp_on: 0,
                };

                socket.emit("addTable", newTable);
            })
            .catch((error) => console.error("Error getting user:", error));
    };

    const isOpenReg = () => {
        setOpenReg(true);
    };
    const isCloseReg = () => {
        setOpenReg(false);
    };
    const isOpenVip = () => {
        setOpenVip(true);
    };
    const isCloseVip = () => {
        setOpenVip(false);
    };

    const handleSessionEnd = () => {
        setSelectedTransaction(null);
        setSelectedTable(null);
        setRemainingTime("00:00:00");
    };

    const handleSelectTable = (id) => {
        setSelectedTable((prevSelected) => (prevSelected === id ? null : id));

        const selectedTableData = tables.find((table) => table.id === id);
        if (selectedTableData) {
            setIsLampOn(selectedTableData.is_lamp_on);
        }

        const activeTransaction = transactions.find(
            (transaction) => transaction.id_billiard === id && transaction.is_active === true
        );

        setSelectedTransaction(activeTransaction ? activeTransaction.id : null);
    };

    return (
        <div className="flex h-full w-full p-4 gap-2 overflow-hidden">
            <div className="flex h-full w-3/4 shadow-md border border-double-light rounded-md bg-white relative overflow-hidden">
                {tables.map((table) => (
                    <div
                        key={table.id}
                        className="shape absolute cursor-pointer"
                        data-id={table.id}
                        data-x={table.x}
                        data-y={table.y}
                        data-width={table.width}
                        data-height={table.height}
                        data-rotation={table.rotation}
                        style={{
                            width: table.width,
                            height: table.height,
                            transform: `translate(${table.x}px, ${table.y}px) rotate(${table.rotation}deg)`,
                        }}
                        onClick={() => handleSelectTable(table.id)}
                    >

                        {selectedTable === table.id && (
                            <div className="flex flex-col gap-1 absolute z-10 -top-5 -right-5">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDialogEditOpen(true);
                                    }}
                                >
                                    <IoSettings size={18} className="text-gray-700 cursor-pointer" />
                                </button>
                                <MdRotateLeft size={18} className="text-gray-500" />
                            </div>
                        )}
                        <img
                            src={
                                table.is_lamp_on === 0
                                    ? (table.role === "vip"
                                        ? "/images/unavailable_vip.png"
                                        : "/images/unavailable_reg.png")
                                    : (table.role === "vip"
                                        ? "/images/available_vip.png"
                                        : "/images/available_reg.png")
                            }
                            alt=""
                            className="w-full h-full"
                        />
                    </div>
                ))}
                {isDialoEditOpen && (
                    <DialogEditTable
                        selectedTable={tables.find((table) => table.id === selectedTable)}
                        onClose={() => setIsDialogEditOpen(false)}
                    />
                )}
            </div>
            <div className="flex flex-col gap-2 h-full w-1/4 py-2 px-4 shadow-md border border-double-light rounded-md bg-white overflow-y-auto custom-scrollbar">
                <div className="flex w-full justify-between">
                    <p className="text-base font-semibold text-black-primary">Status/Tersedia</p>
                    <p className="text-base font-semibold text-black-primary">{remainingTime}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <NavigationButton onClick={() => addTable("regular")} imgSrc="/images/available_reg.png" text="Add Table Regular" icon={IoSettingsOutline} onClickTwo={isOpenReg} />
                    {openReg && (
                        <FormTableReg isCloseReg={isCloseReg} role="regular" />
                    )}
                    <NavigationButton onClick={() => addTable("vip")} imgSrc="/images/available_vip.png" text="Add Table VIP" icon={IoSettingsOutline} onClickTwo={isOpenVip} />
                    {openVip && (
                        <FormTableVip isCloseVip={isCloseVip} role="vip" />
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <p className="text-base font-semibold text-black-primary">Detail Status</p>
                    <div className="flex flex-col gap-1">
                        <DialogTransaction Icon={GiEntryDoor} selectedTable={selectedTable} isLampOn={isLampOn} setSelectedTable={setSelectedTable} />
                        <DialogEnd Icon={IoClose} tables={tables.find((table) => table.id === selectedTable)} selectedTable={selectedTable} selectedTransaction={selectedTransaction} onSessionEnd={handleSessionEnd} />
                        <InformationDetail
                            selectedTable={selectedTable}
                            tables={tables.find((table) => table.id === selectedTable)}
                            transactions={transactions.filter((transaction) => transaction.id_billiard === selectedTable)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}