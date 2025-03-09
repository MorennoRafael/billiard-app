import Auth from "../models/authModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUserById = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded.id;

        const response = await Auth.findAll({
            where: { id }
        })

        res.status(200).json({ message: "Success", response });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export const createAccount = async (req, res) => {
    try {
        const { business_name, email, password, confirm_password, role } = req.body;
        const errors = [];

        const emailExists = await Auth.findOne({ where: { email } });

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!business_name || !email || !password || !confirm_password || !role) {
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
        if (password !== confirm_password) {
            errors.push({ message: "Passwords do not match" });
        }

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Auth.create({
            business_name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(200).json({ success: true, message: "Registration successful" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Auth.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        const token = jwt.sign({ id: user.role === "owner" ? user.id : user.owner_id }, process.env.JWT_SECRET, { expiresIn: "2d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 2 * 24 * 60 * 60 * 1000,
        });

        res.json({ message: "Login successful" });
    } catch (error) {
        console.error("Login failed:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const checkAuth = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ authenticated: false, message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Auth.findOne({ where: { id: decoded.id } });

        if (!user) {
            return res.status(401).json({ authenticated: false, message: "User not found" });
        }

        res.status(200).json({ authenticated: true, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        res.status(401).json({ authenticated: false, message: "Invalid token" });
    }
};

export const logoutController = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });

    return res.status(200).json({ message: "Logout berhasil" });
};



