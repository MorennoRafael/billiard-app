import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import InputField from "../components/form/InputField";

export default function LoginPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:4000/login", formData, {
                withCredentials: true,
            });

            Swal.fire("Login Success!", "You are now logged in.", "success").then(() => {
                navigate("/");
            });
        } catch (error) {
            Swal.fire("Login Failed!", "Incorrect email or password. Please try again.", "error");
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="flex h-screen w-full">
            <div className="flex order-1 h-full w-1/2 pr-4 pt-4 pb-4">
                <img src="/images/Billiards.jpg" alt="billiards" className="h-full w-full object-left-top object-cover rounded-lg" />
            </div>

            <div className="flex justify-center items-center h-full w-1/2">
                <div className="flex flex-col gap-6 w-8/10">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-5xl font-semibold text-black-primary">Log in account</h1>
                        <p className="text-base font-medium text-primary-light">
                            Don&apos;t have an account? <a href="/register" className="text-[#660708] underline">Sign Up</a>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
                            <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
                        </div>

                        <div className="flex flex-col gap-6">
                            <button type="submit" className="py-3 w-full rounded-md border border-[#660708] bg-white font-semibold text-base text-[#660708] hover:bg-[#660708] hover:text-white">
                                Log in
                            </button>

                            <div className="flex items-center text-primary-light text-sm before:flex-1 before:border-t before:border-primary-light before:mr-4 after:flex-1 after:border-t after:border-primary-light after:ml-4">
                                Or login with
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
    );
}
