import "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/components/form/InputField";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { IoIosAdd } from "react-icons/io";
import PropTypes from "prop-types";

export default function AddEmployee({ refreshData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        employee_name: "",
        email: "",
        password: "",
        role: "employee"
    });

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

        if (!formData.employee_name || !formData.email || !formData.password) {
            toast.error("Please enter all fields.");
            return;
        }

        if (!isStrongPassword(formData.password)) {
            toast.error("Password must contain uppercase, lowercase, number, and be at least 8 characters.");
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/user", {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();
            const userId = data.response?.[0]?.id;

            if (!userId) {
                toast.error("User not found!");
                return;
            }

            const table = {
                employee_name: formData.employee_name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                owner_id: userId,
            };

            await axios.post("http://localhost:4000/employee", table);
            toast.success("Add employee successful!");
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
            <button className="flex items-center gap-1 px-4 py-2 text-white bg-[#660708] rounded-md cursor-pointer" onClick={() => setIsOpen(true)}>
                <IoIosAdd size={24} />
                <p className="font-semibold">Add</p>
            </button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="font-bold text-black-primary text-2xl">Add Employee</DialogTitle>
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
                            label="Password"
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

AddEmployee.propTypes = {
    refreshData: PropTypes.func
};
