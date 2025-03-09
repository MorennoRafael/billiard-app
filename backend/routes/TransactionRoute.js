import express from "express";
import { getTransaction } from "../controllers/TransactionController.js";

const router = express.Router();

router.get('/transaction', getTransaction);

export default router;