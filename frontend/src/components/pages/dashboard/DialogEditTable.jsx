import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { io } from "socket.io-client";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/components/form/InputField";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io("http://localhost:4000");

export default function DialogEditTable({ selectedTable, onClose }) {
    const [tableData, setTableData] = useState({
        width: "",
        height: "",
        rotation: "",
    });

    useEffect(() => {
        if (!selectedTable || typeof selectedTable === "number") return;

        setTableData({
            width: selectedTable.width?.toString() || "",
            height: selectedTable.height?.toString() || "",
            rotation: selectedTable.rotation?.toString() || "",
        });
    }, [selectedTable]);

    useEffect(() => {
        const handleTableUpdated = (data) => {
            if (data.id === selectedTable?.id) {
                toast.success("Perubahan berhasil disimpan!");
                setTableData({
                    width: data.width.toString(),
                    height: data.height.toString(),
                    rotation: data.rotation.toString(),
                });
                onClose();
            }
        };

        socket.on("tableUpdated", handleTableUpdated);
        socket.on("updateTableError", (error) => {
            toast.error(`Gagal memperbarui tabel: ${error.message}`);
        });

        return () => {
            socket.off("tableUpdated", handleTableUpdated);
            socket.off("updateTableError");
        };
    }, [selectedTable, onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (value !== "" && (!/^\d+$/.test(value) || parseInt(value, 10) < 0)) {
            toast.error("Masukkan angka yang valid! Tidak boleh negatif atau huruf.");
            return;
        }

        setTableData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!selectedTable || typeof selectedTable === "number") {
            toast.error("Table tidak valid!");
            return;
        }

        if (Object.values(tableData).some((val) => val === "" || parseInt(val, 10) <= 0)) {
            toast.warning("Width, Height, dan Rotation harus lebih dari 0!");
            return;
        }

        const updatedTable = {
            id: selectedTable.id,
            width: parseInt(tableData.width, 10),
            height: parseInt(tableData.height, 10),
            rotation: parseInt(tableData.rotation, 10),
        };

        socket.emit("updateTable", updatedTable);
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="font-bold text-black-primary text-2xl">Edit Table</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <InputField
                        label="Width"
                        type="number"
                        name="width"
                        className="w-full"
                        placeholder="Enter width (px)"
                        value={tableData.width}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Height"
                        type="number"
                        name="height"
                        className="w-full"
                        placeholder="Enter height (px)"
                        value={tableData.height}
                        onChange={handleChange}
                    />
                    <InputField
                        label="Rotation"
                        type="number"
                        name="rotation"
                        className="w-full"
                        placeholder="Enter rotation (°)"
                        value={tableData.rotation}
                        onChange={handleChange}
                    />
                </div>
                <DialogFooter>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="w-2/4 px-2 py-1 rounded-md border border-[#660708] bg-white font-semibold text-base text-[#660708] hover:bg-[#660708] hover:text-white"
                    >
                        Save Changes
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

DialogEditTable.propTypes = {
    selectedTable: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            width: PropTypes.number,
            height: PropTypes.number,
            rotation: PropTypes.number,
        }),
    ]),
    onClose: PropTypes.func.isRequired,
};
