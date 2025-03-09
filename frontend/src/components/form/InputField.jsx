import clsx from "clsx";
import PropTypes from "prop-types";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { useState } from "react";

export default function InputField({
    label,
    name,
    type = "text",
    message = "",
    onChange,
    placeholder,
    className = "",
    min = 0,
    value,
}) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className={clsx("flex flex-col gap-1", className)}>
            <label htmlFor={name} className="text-base font-semibold text-primary-light">
                {label}
            </label>
            <div className="flex relative items-center">
                <input
                    type={showPassword ? "text" : type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={clsx(
                        "w-full px-3 py-2 shadow-md border border-primary-light bg-white rounded-md focus:outline-1 focus:outline-[#A4161A] text-base font-normal"
                    )}
                    required
                    min={type === "number" ? min : undefined}
                />
                {type === "password" && (
                    <div onClick={togglePasswordVisibility} className="absolute z-10 right-2 cursor-pointer">
                        {showPassword ? (
                            <FaRegEye size={22} className="text-primary-light" />
                        ) : (
                            <FaRegEyeSlash size={22} className="text-primary-light" />
                        )}
                    </div>
                )}
            </div>
            {message && <p className="text-sm text-red-500">{message}</p>}
        </div>
    );
}

InputField.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    message: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    min: PropTypes.number,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
