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

  // filter by name
  if (request.query.name) {
    productQuery = productQuery.find({
      name: { $regex: request.query.name, $options: "i" },
    });
  }

  // filter by brand
  if (request.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: request.query.brand, $options: "i" },
    });
  }

  // filter by category
  if (request.query.category) {
    productQuery = productQuery.find({
      category: { $regex: request.query.category, $options: "i" },
    });
  }

  // filter by color
  if (request.query.color) {
    productQuery = productQuery.find({
      colors: { $regex: request.query.color, $options: "i" },
    });
  }

  // filter by size
  if (request.query.size) {
    productQuery = productQuery.find({
      sizes: { $regex: request.query.size, $options: "i" },
    });
  }

  /*
  if (request.query.size) {
    productQuery = productQuery.find({
      sizes: request.query.size.toUpperCase(),
    });
  }
  */

  // filter by price range
  if (request.query.price) {
    const priceRangeArr = request.query.price.split("-");
    // gte -> greater than or equal to
    // lte -> less than or equal to
    productQuery = productQuery.find({
      price: {
        $gte: priceRangeArr[0],
        $lte: priceRangeArr[1],
      },
    });
  }

  // await the query
  const products = await productQuery;

  response.json({
    status: "success",
    products,
  });
});
