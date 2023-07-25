import express from "express";
import {
  createCategoryCtrl,
  deleteCategoryCtrl,
  getAllCategoriesCtrl,
  getSingleCategoryCtrl,
  updateCategoryCtrl,
} from "../controllers/categoriesCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import categoryUpload from "../config/categoryUpload.js";

const categoriesRouter = express.Router();

categoriesRouter.post(
  "/",
  isLoggedIn,
  categoryUpload.single("file"),
  createCategoryCtrl
);
categoriesRouter.get("/", getAllCategoriesCtrl);
categoriesRouter.get("/:id", getSingleCategoryCtrl);
categoriesRouter.put("/:id", updateCategoryCtrl);
categoriesRouter.delete("/:id", deleteCategoryCtrl);

export default categoriesRouter;
