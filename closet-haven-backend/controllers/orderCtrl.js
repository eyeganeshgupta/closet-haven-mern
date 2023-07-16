import Order from "../model/Order.js";
import asyncHandler from "express-async-handler";

// @desc        Create orders
// @route       POST /api/v1/orders
// @access      Private
export const createOrderCtrl = asyncHandler(async (request, response) => {
  // 1. Find the user
  // 2. Get the payload(customer, orderItems, shippingAddress, totalPrice)
  // 3. Check if order is not empty
  // 4. Place / create order -> `save into dataBase`
  // 5. Update the product quantity
  // 6. Make payment (stripe)
  // 7. Payment webHook
  // 8. Update the user order
});
