import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import TableRoute from "./routes/TableRoute.js";
import authRoute from "./routes/authRoute.js";
import TransactionRoute from "./routes/TransactionRoute.js";
import EmployeeRoute from "./routes/employeeRoute.js";
import cron from "node-cron";
import { Server } from 'socket.io';
import http from 'http';
import db from './config/database.js';
import { turnOffLamp } from './controllers/TransactionController.js';
import { handleSocketEvents } from './controllers/TableController.js';
import { transSocketEvents } from './controllers/TransactionController.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(TableRoute, authRoute, TransactionRoute, EmployeeRoute);

cron.schedule("* * * * *", () => turnOffLamp(io));
handleSocketEvents(io);
transSocketEvents(io);

const startServer = async () => {
    try {
        await db.authenticate();
        console.log("Database connected...");
        await db.sync();
        server.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("Database connection error:", error);
    }
};

startServer();
