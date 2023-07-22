import express from "express";
import {
  createCouponCtrl,
  deleteCouponCtrl,
  getAllCouponsCtrl,
  getCouponCtrl,
  updateCouponCtrl,
} from "../controllers/couponCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const couponsRouter = express.Router();

couponsRouter.post("/", isLoggedIn, createCouponCtrl);
couponsRouter.get("/", getAllCouponsCtrl);
couponsRouter.get("/:id", getCouponCtrl);
couponsRouter.put("/update/:id", updateCouponCtrl);
couponsRouter.delete("/delete/:id", deleteCouponCtrl);

export default couponsRouter;
