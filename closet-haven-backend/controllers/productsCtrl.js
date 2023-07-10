import Product from "../model/Product.js";
import asyncHandler from "express-async-handler";

// @desc Create new product
// @route POST /api/v1/products
// @access Private/Admin

export const createProductCtrl = asyncHandler(async (request, response) => {
  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand,
  } = request.body;

  // Product Exists
  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error("Product Already Exists");
  }

  // create the product
  const product = await Product.create({
    name,
    description,
    category,
    sizes,
    colors,
    user: request.userAuthId,
    price,
    totalQty,
    brand,
  });

  // push the product into category

  // send response
  response.json({
    status: "success",
    message: "Product created successfully",
    product,
  });
});

// @desc Get all products
// @route GET /api/v1/products
// @access Public

export const getProductsCtrl = asyncHandler(async (request, response) => {
  // query
  let productQuery = Product.find();

  // search by name
  if (request.query.name) {
    productQuery = productQuery.find({
      name: { $regex: request.query.name, $options: "i" },
    });
  }

  // await the query
  const products = await productQuery;

  response.json({
    status: "success",
    products,
  });
});
