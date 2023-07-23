import express from "express";
import {
  createProductCtrl,
  deleteProductCtrl,
  getProductCtrl,
  getProductsCtrl,
  updateProductCtrl,
} from "../controllers/productsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import upload from "../config/fileUpload.js";

const productsRouter = express.Router();

productsRouter.post("/", isLoggedIn, upload.array("files"), createProductCtrl);
productsRouter.get("/", getProductsCtrl);
productsRouter.get("/:id", getProductCtrl);
productsRouter.put("/:id", isLoggedIn, updateProductCtrl);
productsRouter.delete("/:id/delete", isLoggedIn, deleteProductCtrl);

export default productsRouter;
