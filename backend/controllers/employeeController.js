import Auth from "../models/authModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

export const getEmployee = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id_user = decoded.id;

        const searchQuery = req.query.search ? req.query.search.toLowerCase() : "";

        const response = await Auth.findAll({
            where: {
                owner_id: id_user,
                role: "employee",
                ...(searchQuery && {
                    employee_name: { [Op.iLike]: `%${searchQuery}%` }
                })
            },
            attributes: ["id", "employee_name", "email", "role"]
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



export const addEmployee = async (req, res) => {
    try {
        const { employee_name, email, password, role, owner_id } = req.body;
        const errors = [];

        const emailExists = await Auth.findOne({ where: { email } });

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!employee_name || !email || !password || !role) {
            errors.push({ message: "Please enter all fields" });
        }
        if (emailExists) {
            errors.push({ message: "Email already registered" });
        }
        if (password.length < 8) {
            errors.push({ message: "Password should be at least 8 characters" });
        }
        if (!passwordRegex.test(password)) {
            errors.push({
                message: "Password must include at least one lowercase letter, one uppercase letter, and one number.",
            });
        }

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Auth.create({
            employee_name,
            email,
            password: hashedPassword,
            owner_id: owner_id,
            role,
        });

        res.status(200).json({ success: true, message: "Registration successful" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRows = await Auth.destroy({
            where: {
                id: id
            }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editEmployee = async (req, res) => {
    const { id } = req.params;
    const { employee_name, email, password } = req.body;
    const errors = [];

    try {
        const employee = await Auth.findByPk(id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        if (email && email !== employee.email) {
            const emailExists = await Auth.findOne({ where: { email } });
            if (emailExists) {
                errors.push({ message: "Email already registered" });
            }
        }

        let hashedPassword = employee.password;
        if (password) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (password.length < 8) {
                errors.push({ message: "Password should be at least 8 characters" });
            }
            if (!passwordRegex.test(password)) {
                errors.push({
                    message: "Password must include at least one lowercase letter, one uppercase letter, and one number.",
                });
            }
            hashedPassword = await bcrypt.hash(password, 10);
        }

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const [updatedRows] = await Auth.update(
            { employee_name, email, password: hashedPassword },
            { where: { id } }
        );

        if (updatedRows === 0) {
            return res.status(400).json({ message: "No changes made" });
        }

        const updatedEmployee = await Auth.findByPk(id);

        res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            data: updatedEmployee,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const countEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await Auth.count({
            where: {
                owner_id: id,
                role: "employee"
            }
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const countOnlineEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const count = await Auth.count({
            where: {
                owner_id: id,
                role: "employee",
                is_active: 1
            }
        });

        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const countEmployeeThisMonth = async (req, res) => {
    const { id } = req.params;

    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const count = await Auth.count({
            where: {
                owner_id: id,
                role: "employee",
                createdAt: {
                    [Op.gte]: startOfMonth,
                    [Op.lte]: endOfMonth
                }
            }
        });

        console.log(count)

        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


