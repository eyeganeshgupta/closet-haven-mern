import Product from "../model/Product.js";
import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";
import Brand from "../model/Brand.js";

// @desc        Create new product
// @route       POST /api/v1/products
// @access      Private/Admin
export const createProductCtrl = asyncHandler(async (request, response) => {
  const convertedImages = request.files.map((file) => file.path);

  const { name, description, category, sizes, colors, price, totalQty, brand } =
    request.body;

  // Product Exists
  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error("Product Already Exists");
  }

  // find the brand
  const brandFound = await Brand.findOne({ name: brand });
  if (!brandFound) {
    throw new Error(
      "Brand not found, please create brand first or check brand name"
    );
  }

  // find the category
  const categoryFound = await Category.findOne({ name: category });
  if (!categoryFound) {
    throw new Error(
      "Category not found, please create category first or check category name"
    );
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
    images: convertedImages,
  });

  // push the product into category
  categoryFound.products.push(product._id);
  // resave
  await categoryFound.save();

  // push the product into brand
  brandFound.products.push(product._id);
  // resave
  await brandFound.save();

  // send response
  response.json({
    status: "success",
    message: "Product created successfully",
    product,
  });
});

// @desc        Get all products
// @route       GET /api/v1/products
// @access      Public
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

  /* --- Pagination --- */
  // Pagination simply means that returning some amount of record per request or per page

  // page
  const page = parseInt(request.query.page) ? parseInt(request.query.page) : 1;
  // limit
  const limit = parseInt(request.query.limit)
    ? parseInt(request.query.limit)
    : 10;
  // startIndex
  const startIndex = (page - 1) * limit;
  // endIndex
  const endIndex = page * limit;
  // totalProduct or totalRecord
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

  /* --- Pagination Results */
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit,
    };
  }

  // await the query
  const products = await productQuery.populate("reviews");

  response.json({
    status: "success",
    total,
    results: products.length,
    pagination,
    message: "Products fetched successfully",
    products,
  });
});

// @desc        Get single product
// @route       GET /api/products/:id
// @access      Public
export const getProductCtrl = asyncHandler(async (request, response) => {
  const product = await Product.findById(request.params.id).populate("reviews");

  if (!product) {
    throw new Error("Product not found!");
  }

  response.json({
    status: "success",
    message: "Product fetched successfully",
    product,
  });
});

// @desc        update product
// @route       PUT /api/products/:id/update
// @access      Private/Admin
export const updateProductCtrl = asyncHandler(async (request, response) => {
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

  // update
  const product = await Product.findByIdAndUpdate(
    request.params.id,
    {
      name,
      description,
      category,
      sizes,
      colors,
      user,
      price,
      totalQty,
      brand,
    },
    {
      new: true,
    }
  );

  response.json({
    status: "success",
    message: "Product updated successfully",
    product,
  });
});

// @desc        delete product
// @route       DELETE /api/products/:id/delete
// @access      Private/Admin
export const deleteProductCtrl = asyncHandler(async (request, response) => {
  await Product.findByIdAndDelete(request.params.id);
  response.json({
    status: "success",
    message: "Product deleted sucessfully",
  });
});
