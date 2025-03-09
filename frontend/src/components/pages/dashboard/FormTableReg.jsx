import { useState } from "react";
import { IoClose } from "react-icons/io5";
import PropTypes from "prop-types";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export default function FormTableReg({ isCloseReg, role }) {
    const [formData, setFormData] = useState({
        width: "",
        height: "",
        rotation: ""
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSave = () => {
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

                const table = {
                    id_user: userId,
                    role: role,
                    width: parseInt(formData.width) || 0,
                    height: parseInt(formData.height) || 0,
                    rotation: parseInt(formData.rotation) || 0
                };

                socket.emit("updateAllTable", table);
            });

        isCloseReg();
    };

    return (
        <div className="flex flex-col gap-1 py-2 px-3 w-full border border-double-light rounded-md">
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <label htmlFor="width" className="text-base font-semibold text-primary-light">Width</label>
                    <IoClose onClick={isCloseReg} size={24} className="text-[#BA181B] cursor-pointer" />
                </div>
                <input type="text" id="width" value={formData.width} onChange={handleChange} className="px-2 py-1 border border-primary-light bg-triple-light rounded-md focus:outline-2 focus:outline-[#A4161A] text-base font-medium" placeholder="Enter width (px)" />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="height" className="text-base font-semibold text-primary-light">Height</label>
                <input type="text" id="height" value={formData.height} onChange={handleChange} className="px-2 py-1 border border-primary-light bg-triple-light rounded-md focus:outline-2 focus:outline-[#A4161A] text-base font-medium" placeholder="Enter height (px)" />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="rotation" className="text-base font-semibold text-primary-light">Rotation</label>
                <input type="text" id="rotation" value={formData.rotation} onChange={handleChange} className="px-2 py-1 border border-primary-light bg-triple-light rounded-md focus:outline-2 focus:outline-[#A4161A] text-base font-medium" placeholder="Enter rotation (°)" />
            </div>
            <div className="flex flex-col pt-1">
                <button type="button" onClick={handleSave} className="px-2 py-1 rounded-md border border-[#660708] bg-white font-semibold text-base text-[#660708] hover:bg-[#660708] hover:text-white">Save</button>
            </div>
        </div>
    );
}

FormTableReg.propTypes = {
    isCloseReg: PropTypes.func.isRequired,
    role: PropTypes.string
};
