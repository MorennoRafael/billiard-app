import express from "express";
import { getTables, addTable, deleteTable, editTable, countTable, countTableThisMonth, countOnlineTable } from "../controllers/TableController.js";

const router = express.Router();

router.get('/tables', getTables);
router.delete('/table/:id', deleteTable);
router.post("/tables", addTable);
router.put('/table/:id', editTable);
router.get("/tables/count/:id", countTable);
router.get("/tables/month/:id", countTableThisMonth);
router.get("/tables/online/:id", countOnlineTable);



export default router;