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

export default function DialogEdit({ dataEmployee, refreshData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        employee_name: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        if (dataEmployee) {
            setFormData({
                employee_name: dataEmployee.employee_name || "",
                email: dataEmployee.email || "",
                password: "",
            });
        }
    }, [isOpen, dataEmployee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    function isStrongPassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.employee_name || !formData.email) {
            toast.error("Please enter all required fields.");
            return;
        }

        const updatedData = {
            employee_name: formData.employee_name,
            email: formData.email,
        };

        if (formData.password) {
            if (!isStrongPassword(formData.password)) {
                toast.error("Password must contain uppercase, lowercase, number, and be at least 8 characters.");
                return;
            }
            updatedData.password = formData.password;
        }

        try {
            await axios.put(`http://localhost:4000/employee/${dataEmployee.id}`, updatedData);
            toast.success("Edit employee successful!");
            setIsOpen(false);
            refreshData();
        } catch (error) {
            if (error.response && error.response.data.errors) {
                error.response.data.errors.forEach((err) => {
                    toast.error(err.message);
                });
            }
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
                        <DialogTitle className="font-bold text-black-primary text-2xl">Edit Employee</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        <InputField
                            label="Employee Name"
                            type="text"
                            name="employee_name"
                            className="w-full"
                            placeholder="Mamang Racing"
                            value={formData.employee_name}
                            onChange={handleChange}
                        />
                        <InputField
                            label="Email"
                            type="email"
                            name="email"
                            className="w-full"
                            placeholder="example@.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <InputField
                            label="New Password (Leave blank if unchanged)"
                            type="password"
                            name="password"
                            className="w-full"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <DialogFooter className="mt-2">
                            <button
                                type="submit"
                                className="w-2/5 px-2 py-1 rounded-md border border-[#660708] bg-white font-semibold text-base text-[#660708] hover:bg-[#660708] hover:text-white"
                            >
                                Save Employee
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
    dataEmployee: PropTypes.object.isRequired,
};
