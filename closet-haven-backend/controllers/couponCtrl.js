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

// @desc        Get single coupon
// @route       GET /api/v1/coupons/:id
// @access      Private/Admin
export const getCouponCtrl = asyncHandler(async (request, response) => {
  const coupon = await Coupon.findById(request.params.id);
  response.json({
    status: "success",
    message: "Coupon fetched",
    coupon,
  });
});

// @desc        Update coupon
// @route       PUT /api/v1/coupons/update/:id
// @access      Private/Admin
export const updateCouponCtrl = asyncHandler(async (request, response) => {
  const { code, startDate, endDate, discount } = request.body;
  const coupon = await Coupon.findByIdAndUpdate(
    request.params.id,
    {
      code: code?.toUpperCase(),
      startDate,
      endDate,
      discount,
    },
    {
      new: true,
    }
  );
  response.json({
    status: "success",
    message: "Coupon updated successfully",
    coupon,
  });
});

// @desc        Delete coupon
// @route       DELETE /api/v1/coupons/delete/:id
// @access      Private/Admin
export const deleteCouponCtrl = asyncHandler(async (request, response) => {
  const coupon = await Coupon.findByIdAndDelete(request.params.id);
  response.json({
    status: "success",
    message: "Coupon deleted successfully",
    coupon,
  });
});
