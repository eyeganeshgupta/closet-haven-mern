import Order from "../model/Order.js";
import asyncHandler from "express-async-handler";

// @desc        Create orders
// @route       POST /api/v1/orders
// @access      Private
export const createOrderCtrl = asyncHandler(async (request, response) => {
  response.json({
    message: "Order controller",
  });
});
