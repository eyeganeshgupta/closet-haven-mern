import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import Stripe from "stripe";
import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Coupon from "../model/Coupon.js";

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

  // Get the coupon
  const { coupon } = request?.query;
  const couponFound = await Coupon.findOne({
    code: coupon?.toUpperCase(),
  });
  if (couponFound?.isExpired) {
    throw new Error("Coupon has expired!");
  }
  if (!couponFound) {
    throw new Error("Coupon doesnt exists");
  }

  // get discount
  const discount = couponFound?.discount / 100;

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
    totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
  });

  console.log(order);

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
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  response.send({
    url: session.url,
  });

  // 9. Payment webHook
  // 10. Update the user order
});

// @desc        Get all orders
// @route       GET /api/v1/orders
// @access      Private
export const getAllOrdersCtrl = asyncHandler(async (request, response) => {
  // find/fetch all orders
  const orders = await Order.find();
  response.json({
    success: true,
    message: "All orders",
    orders,
  });
});

// @desc        Get single order
// @route       GET /api/v1/orders/:id
// @access      Private/Admin
export const getSingleOrderCtrl = asyncHandler(async (request, response) => {
  // get id from params
  const id = request.params.id;
  const order = await Order.findById(id);
  // send response
  response.status(200).json({
    success: true,
    message: "Single order",
    order,
  });
});

// @desc        Update order to delivered
// @route       PUT /api/v1/orders/update/:id
// @access      Private/Admin
export const updateOrderCtrl = asyncHandler(async (request, response) => {
  // get the id from params
  const id = request.params.id;

  // update
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: request.body.status,
    },
    {
      new: true,
    }
  );

  response.status(200).json({
    success: true,
    message: "Order status updated!",
    updatedOrder,
  });
});

// @desc        Get Sales sum of orders
// @route       GET /api/v1/orders/sales/sum
// @access      Private/Admin
export const getSalesSumCtrl = asyncHandler(async (request, response) => {
  // get the sales
  const sales = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  // send response
  response.status(200).json({
    success: true,
    message: "Sum of orders",
    sales,
  });
});
