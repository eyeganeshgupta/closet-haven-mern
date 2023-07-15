import Product from "../model/Product.js";
import Review from "../model/Review.js";
import asyncHandler from "express-async-handler";

// @desc        Create new review
// @route       POST /api/reviews
// @access      Private/Admin
export const createReviewCtrl = asyncHandler(async (request, response) => {
  const { product, message, rating } = request.body;

  // 1. Finding the product that we want to review
  const { productID } = request.params;
  const productFound = await Product.findById(productID);
  if (!productFound) {
    throw new Error("Product not found!");
  }

  // 2. Checking if user already reviewed this product

  // 3. Create Review
  const review = await Review.create({
    user: request.userAuthId,
    product: productFound?._id,
    message,
    rating,
  });

  // 4. Push review into product Found
  productFound.reviews.push(review?._id);
  // resave
  await productFound.save();

  response.status(201).json({
    success: true,
    message: "Review created successfully",
  });
});
