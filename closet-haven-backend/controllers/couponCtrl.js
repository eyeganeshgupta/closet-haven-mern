import asyncHandler from "express-async-handler";
import Coupon from "../model/Coupon.js";

// @desc        Create new Coupon
// @route       POST /api/v1/coupons
// @access      Private/Admin
export const createCouponCtrl = asyncHandler(async (request, response) => {
  // destructing the payLoad
  const { code, startDate, endDate, discount } = request.body;

  // check if admin

  // check if coupon already exists
  const couponsExists = await Coupon.findOne({
    code,
  });

  if (couponsExists) {
    throw new Error("Coupon already exists");
  }

  // check if discount is a number
  if (isNaN(discount)) {
    throw new Error("Discount value must be a number");
  }

  // create coupon
  const coupon = await Coupon.create({
    code: code?.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: request.userAuthId,
  });

  // send the response
  response.status(201).json({
    status: "success",
    message: "Coupon created successfully",
    coupon,
  });
});

// @desc        Get all coupons
// @route       GET /api/v1/coupons
// @access      Private/Admin
export const getAllCouponsCtrl = asyncHandler(async (request, response) => {
  const coupons = await Coupon.find();
  response.status(200).json({
    status: "success",
    message: "All coupons",
    coupons,
  });
});
