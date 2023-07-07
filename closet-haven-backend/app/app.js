import dotenv from "dotenv";
import express from "express";
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/usersRoute.js";
import { globalErrHandler } from "../middlewares/globalErrHandler.js";

dotenv.config();

// database connection
dbConnect();

const app = express();

// pass incoming data
app.use(express.json());

// routes
app.use('/', userRoutes);

// error middleware
app.use(globalErrHandler);

export default app;
