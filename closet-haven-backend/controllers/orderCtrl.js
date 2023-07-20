import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import Stripe from "stripe";
import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/Product.js";

dotenv.config();

// stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

// @desc        Create orders
// @route       POST /api/v1/orders
// @access      Private
export const createOrderCtrl = asyncHandler(async (request, response) => {
  // 1. Find the user
  const user = await User.findById(request.userAuthId);

  // 2. Get the payload(orderItems, shippingAddress, totalPrice)
  const { orderItems, shippingAddress, totalPrice } = request.body;

  // 3. Check if the user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }

  // 4. Check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("No order items");
  }

  // 5. Place / create order -> `save into dataBase`
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice,
  });

  // 6. Update the product quantity
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

  // 7. Push order into user
  user.orders.push(order?._id);
  await user.save();

  // 8. Make payment (stripe)

  // convert order items to have same structure that stripe need
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  response.send({
    url: session.url,
  });

  // 9. Payment webHook
  // 10. Update the user order

  /*
  response.json({
    success: true,
    message: "Order created",
    order,
    user,
  });
  */
});
