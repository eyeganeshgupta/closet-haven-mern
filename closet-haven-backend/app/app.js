import express from "express";
import dbConnect from "../config/dbConnect.js";

// database connection
dbConnect();

const app = express();

export default app;
