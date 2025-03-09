import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import InputField from "../components/form/InputField";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        business_name: "",
        email: "",
        password: "",
        confirm_password: "",
        role: "owner",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    function isStrongPassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.business_name || !formData.email || !formData.password || !formData.confirm_password) {
            toast.error("Please enter all fields.");
            return;
        }

        if (!isStrongPassword(formData.password)) {
            toast.error("Password must contain uppercase, lowercase, number, and be at least 8 characters.");
            return;
        }

        if (formData.password !== formData.confirm_password) {
            toast.error("Password and Confirm Password do not match.");
            return;
        }

        try {
            await axios.post("http://localhost:4000/register", formData);
            Swal.fire({
                title: "Registration Success!",
                text: "You have successfully registered.",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                navigate("/login");
            });
        } catch (error) {
            if (error.response && error.response.data.errors) {
                error.response.data.errors.forEach((err) => {
                    toast.error(err.message);
                });
            }
        }
    };

    return (
        <div className="flex h-screen w-full">
            <div className="flex h-full w-1/2 pl-4 pt-4 pb-4">
                <img src="/images/Billiards.jpg" alt="billiards" className="h-full w-full object-left-top object-cover rounded-lg" />
            </div>
            <div className="w-1/2">
                <div className="flex py-6 justify-center items-center h-full overflow-y-auto">
                    <div className="flex flex-col gap-6 w-8/10">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-5xl font-semibold text-black-primary">Create an account</h1>
                            <p className="text-base font-medium text-primary-light">
                                Already have an account? <a href="/login" className="text-[#660708] underline">Log in</a>
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <InputField label="Business name" name="business_name" type="text" value={formData.business_name} onChange={handleChange} />
                                <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                                <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
                                <InputField label="Confirm password" name="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange} />
                            </div>
                            <div className="flex flex-col gap-4">
                                <button type="submit" className="py-3 w-full rounded-md border border-[#660708] bg-white font-semibold text-base text-[#660708] hover:bg-[#660708] hover:text-white">
                                    Register
                                </button>
                                <div className="flex items-center text-primary-light text-sm before:flex-1 before:border-t before:border-primary-light before:mr-4 after:flex-1 after:border-t after:border-primary-light after:ml-4">
                                    Or register with
                                </div>
                                <div className="flex justify-center gap-4">
                                    <button className="flex py-1 rounded-md shadow-md w-2/10 border border-primary-light gap-1 items-center justify-center hover:bg-triple-light">
                                        <FcGoogle size={28} />
                                        <p className="text-base font-semibold text-primary-light">Google</p>
                                    </button>
                                    <button className="flex py-1 rounded-md shadow-md w-2/10 border border-primary-light gap-1 items-center justify-center hover:bg-triple-light">
                                        <FaFacebook size={28} color="#1877F2" />
                                        <p className="text-base font-semibold text-primary-light">Facebook</p>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
