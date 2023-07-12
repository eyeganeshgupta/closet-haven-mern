import Category from "../model/Category.js";
import asyncHandler from "express-async-handler";

// @desc        Create new category
// @route       POST /api/v1/categories
// @access      Private/Admin
export const createCategoryCtrl = asyncHandler(async (request, response) => {
  const { name } = request.body;

  // category exists
  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    throw new Error(`Category ${name} already exists`);
  }

  // create category
  const category = await Category.create({
    name,
    user: request.userAuthId,
  });

  response.json({
    status: "success",
    message: "Category created successfully",
    category,
  });
});
