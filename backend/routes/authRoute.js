import express from "express";
import { createAccount, getUserById, login, checkAuth, logoutController } from "../controllers/authController.js";

const router = express.Router();


router.get("/auth/check", checkAuth);
router.get('/user', getUserById);
router.post('/register', createAccount);
router.post('/login', login);
router.post("/logout", logoutController);


export default router;