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
    code,
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
