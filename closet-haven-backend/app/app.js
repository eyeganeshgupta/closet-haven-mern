import dotenv from "dotenv";
import express from "express";
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/usersRoute.js";
import { globalErrHandler, notFound } from "../middlewares/globalErrHandler.js";
import productsRouter from "../routes/productsRoute.js";
import categoriesRouter from "../routes/categoriesRoute.js";
import brandsRouter from "../routes/brandsRoute.js";
import colorsRouter from "../routes/colorRoute.js";
import reviewRouter from "../routes/reviewRoute.js";
import orderRouter from "../routes/ordersRoute.js";

dotenv.config();

// database connection
dbConnect();

const app = express();

// pass incoming data
app.use(express.json());

// routes
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productsRouter);
app.use("/api/v1/categories/", categoriesRouter);
app.use("/api/v1/brands/", brandsRouter);
app.use("/api/v1/colors/", colorsRouter);
app.use("/api/v1/reviews/", reviewRouter);
app.use("/api/v1/orders/", orderRouter);

// error middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;
