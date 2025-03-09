import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FaRegEdit } from "react-icons/fa";
import InputField from "@/components/form/InputField";
import axios from "axios";

export default function DialogEdit({ dataTable, refreshData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        table_name: "",
        price: "",
        led_pin: "",
    });

    useEffect(() => {
        if (dataTable) {
            setFormData({
                table_name: dataTable.table_name || "",
                price: dataTable.price || "",
                led_pin: dataTable.led_pin || "",
            });
        }
    }, [isOpen, dataTable]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.table_name || !formData.price || !formData.led_pin) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            await axios.put(`http://localhost:4000/table/${dataTable.id}`, formData);
            toast.success("Table updated successfully!");
            setIsOpen(false);
            refreshData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update table.");
        }
    };

    return (
        <>
            <button className="text-[#FFA726] cursor-pointer" onClick={() => setIsOpen(true)}>
                <FaRegEdit size={20} />
            </button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="font-bold text-black-primary text-2xl">Edit Table</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        <InputField
                            label="Table Name"
                            type="text"
                            name="table_name"
                            className="w-full"
                            placeholder="Table 1"
                            value={formData.table_name}
                            onChange={handleChange}
                        />
                        <InputField
                            label="Price"
                            type="number"
                            name="price"
                            className="w-full"
                            placeholder="10000"
                            value={formData.price}
                            onChange={handleChange}
                        />
                        <InputField
                            label="LED Pin"
                            type="number"
                            name="led_pin"
                            className="w-full"
                            placeholder="12"
                            value={formData.led_pin}
                            onChange={handleChange}
                        />
                        <DialogFooter className="mt-2">
                            <button
                                type="submit"
                                className="w-2/5 px-2 py-1 rounded-md border border-[#660708] bg-white font-semibold text-base text-[#660708] hover:bg-[#660708] hover:text-white"
                            >
                                Save Table
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

DialogEdit.propTypes = {
    refreshData: PropTypes.func,
    dataTable: PropTypes.object.isRequired,
};
