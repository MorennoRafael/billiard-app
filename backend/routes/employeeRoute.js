import express from "express";
import { getEmployee, addEmployee, deleteEmployee, editEmployee, countEmployee, countOnlineEmployee, countEmployeeThisMonth } from "../controllers/employeeController.js";

const router = express.Router();

router.get('/employee', getEmployee);
router.post('/employee', addEmployee);
router.delete("/employee/:id", deleteEmployee);
router.put("/employee/:id", editEmployee);
router.get("/employee/count/:id", countEmployee);
router.get("/employee/month/:id", countEmployeeThisMonth);
router.get("/employee/online/:id", countOnlineEmployee);


export default router;