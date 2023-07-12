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
