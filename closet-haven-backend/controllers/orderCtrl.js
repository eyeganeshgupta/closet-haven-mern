import Order from "../model/Order.js";
import asyncHandler from "express-async-handler";
import User from "../model/User.js";
import Product from "../model/Product.js";

// @desc        Create orders
// @route       POST /api/v1/orders
// @access      Private
export const createOrderCtrl = asyncHandler(async (request, response) => {
  // 1. Find the user
  const user = await User.findById(request.userAuthId);

  // 2. Get the payload(orderItems, shippingAddress, totalPrice)
  const { orderItems, shippingAddress, totalPrice } = request.body;

  // 3. Check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("No order items");
  }

  // 4. Place / create order -> `save into dataBase`
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice,
  });

  // 5. Update the product quantity
  const products = await Product.find({ _id: { $in: orderItems } });
  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });
    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });

  // 6. Push order into user
  user.orders.push(order?._id);
  await user.save();

  // 7. Make payment (stripe)
  // 8. Payment webHook
  // 9. Update the user order

  response.json({
    success: true,
    message: "Order created",
    order,
    user,
  });
});
