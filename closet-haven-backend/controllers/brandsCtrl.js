import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";

// @desc        Create new Brand
// @route       POST /api/brands
// @access      Private/Admin
export const createBrandCtrl = asyncHandler(async (request, response) => {
  const { name } = request.body;

  // brand exists
  const brandFound = await Brand.findOne({ name });
  if (brandFound) {
    throw new Error("Brand already exists");
  }

  // create category
  const brand = await Brand.create({
    name,
    user: request.userAuthId,
  });

  response.json({
    status: "success",
    message: "Brand created successfully",
    brand,
  });
});

// @desc        Get all brands
// @route       GET /api/brands
// @access      Public
export const getAllBrandsCtrl = asyncHandler(async (request, response) => {
  const brands = await Brand.find();
  response.json({
    status: "success",
    message: "Brands fetched successfully",
    brands,
  });
});

// @desc        Get single brand
// @route       GET /api/brands/:id
// @access      Public
export const getSingleBrandCtrl = asyncHandler(async (request, response) => {
  const brand = await Brand.findById(request.params.id);
  response.json({
    status: "success",
    message: "Brand fetched successfully",
    brand,
  });
});

// @desc        Update brand
// @route       PUT /api/brands/:id
// @access      Private/Admin
export const updateBrandCtrl = asyncHandler(async (request, response) => {
  const { name } = request.body;

  // update
  const brand = await Brand.findByIdAndUpdate(
    request.params.id,
    { name },
    { new: true }
  );

  response.json({
    status: "success",
    message: "Brand updated successfully",
    brand,
  });
});

// @desc        Delete brand
// @route       DELETE /api/brands/:id
// @access      Private/Admin
export const deleteBrandCtrl = asyncHandler(async (request, response) => {
  await Brand.findByIdAndDelete(request.params.id);
  response.json({
    status: "success",
    message: "Brand deleted successfully",
  });
});
