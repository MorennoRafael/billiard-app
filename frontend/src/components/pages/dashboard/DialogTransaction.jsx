import "react";
import PropTypes from "prop-types";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/components/form/InputField";
import NavigationButton from "@/components/button/NavigationButton";
import { useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io("http://localhost:4000");

export default function DialogTransaction({ Icon, selectedTable, isLampOn, setSelectedTable }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name_customer: "",
        duration: null
    });

    const handleOpenDialog = () => setIsOpen(true);
    const handleCloseDialog = () => setIsOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveTransaction = () => {
        if (!formData.name_customer || !formData.duration) {
            toast.error("Nama customer dan durasi tidak boleh kosong!");
            return;
        }

        if (isLampOn) {
            toast.error("Meja sedang digunakan, tidak bisa menambahkan transaksi baru!");
            return;
        }

        fetch("http://localhost:4000/user", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                const userId = data.response[0].id;

                if (!userId) {
                    toast.error("User tidak ditemukan!");
                    return;
                }

                socket.emit("addTransaction", {
                    id_user: userId,
                    id_billiard: selectedTable,
                    customer_name: formData.name_customer,
                    duration: formData.duration,
                });

                toast.success("Transaksi berhasil ditambahkan!");
                handleCloseDialog();
                setSelectedTable(null);
            })
            .catch(() => toast.error("Terjadi kesalahan saat menyimpan transaksi."));
    };

    return (
        <>
            <NavigationButton
                text="Check In"
                icon={Icon}
                color="#FFA726"
                isSelectedTableEmpty={selectedTable === null}
                isLampOn={isLampOn}
                onClick={handleOpenDialog}
            />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="font-bold text-black-primary text-2xl">Check In</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-1">
                        <InputField
                            label="Name Customer"
                            type="text"
                            name="name_customer"
                            className="w-3/4"
                            value={formData.name_customer}
                            onChange={handleChange}
                        />
                        <InputField
                            label="Duration/Hour"
                            type="number"
                            name="duration"
                            className="w-1/4"
                            min={1}
                            value={formData.duration}
                            onChange={handleChange}
                        />
                    </div>
                    <DialogFooter>
                        <button
                            type="button"
                            onClick={handleSaveTransaction}
                            className="w-2/4 px-2 py-1 rounded-md border border-[#660708] bg-white font-semibold text-base text-[#660708] hover:bg-[#660708] hover:text-white"
                        >
                            Save Transaction
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

DialogTransaction.propTypes = {
    Icon: PropTypes.elementType,
    selectedTable: PropTypes.number,
    isLampOn: PropTypes.number,
    setSelectedTable: PropTypes.func.isRequired,
};

