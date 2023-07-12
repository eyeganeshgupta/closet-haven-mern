import Category from "../model/Category.js";
import asyncHandler from "express-async-handler";

// @desc        Create new category
// @route       POST /api/categories
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

// @desc        Get all categories
// @route       GET /api/categories
// @access      Public
export const getAllCategoriesCtrl = asyncHandler(async (request, response) => {
  const categories = await Category.find();
  response.json({
    status: "success",
    message: "Categories fetched successfully",
    categories,
  });
});

// @desc        Get single category
// @route       GET /api/categories/:id
// @access      Public
export const getSingleCategoryCtrl = asyncHandler(async (request, response) => {
  const category = await Category.findById(request.params.id);
  response.json({
    status: "success",
    message: `${category.name} category fetched successfully`,
    category,
  });
});

// @desc        Update category
// @route       PUT /api/categories/:id
// @access      Private/Admin
export const updateCategoryCtrl = asyncHandler(async (request, response) => {
  const { name } = request.body;
  // update category
  const category = await Category.findByIdAndUpdate(
    request.params.id,
    { name },
    { new: true }
  );
  response.json({
    status: "success",
    message: "Category updated successfully",
    category,
  });
});

// @desc        Delete category
// @route       DELETE /api/categories/:id
// @access      Private/Admin
export const deleteCategoryCtrl = asyncHandler(async (request, response) => {
  await Category.findByIdAndDelete(request.params.id);
  response.json({
    status: "success",
    message: "Category deleted successfully",
  });
});
