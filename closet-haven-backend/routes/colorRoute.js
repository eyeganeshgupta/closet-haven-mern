import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  createColorCtrl,
  deleteColorCtrl,
  getAllColorsCtrl,
  getSingleColorCtrl,
  updateColorCtrl,
} from "../controllers/colorsCtrl.js";

const colorsRouter = express.Router();

colorsRouter.post("/", isLoggedIn, createColorCtrl);
colorsRouter.get("/", getAllColorsCtrl);
colorsRouter.get("/:id", getSingleColorCtrl);
colorsRouter.put("/:id", updateColorCtrl);
colorsRouter.delete("/:id", deleteColorCtrl);

export default colorsRouter;
