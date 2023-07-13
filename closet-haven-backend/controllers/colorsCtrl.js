import asyncHandler from "express-async-handler";
import Color from "../model/Color.js";

// @desc        Create new Color
// @route       POST /api/colors
// @access      Private/Admin
export const createColorCtrl = asyncHandler(async (request, response) => {
  const { name } = request.body;

  // color exists
  const colorFound = await Color.findOne({ name });
  if (colorFound) {
    throw new Error("Brand already exists");
  }

  // create color
  const color = await Color.create({
    name,
    user: request.userAuthId,
  });

  response.json({
    status: "success",
    message: "Color created successfully",
    color,
  });
});

// @desc        Get all colors
// @route       GET /api/colors
// @access      Public
export const getAllColorsCtrl = asyncHandler(async (request, response) => {
  const colors = await Color.find();
  response.json({
    status: "success",
    message: "Colors fetched successfully",
    colors,
  });
});

// @desc        Get single color
// @route       GET /api/colors/:id
// @access      Public
export const getSingleColorCtrl = asyncHandler(async (request, response) => {
  const color = await Color.findById(request.params.id);
  response.json({
    status: "success",
    message: "color fetched successfully",
    color,
  });
});

// @desc        Update color
// @route       PUT /api/colors/:id
// @access      Private/Admin
export const updateColorCtrl = asyncHandler(async (request, response) => {
  const { name } = request.body;

  // update color
  const color = await Color.findByIdAndUpdate(
    request.params.id,
    { name },
    { new: true }
  );

  response.json({
    status: "success",
    message: "color updated successfully",
    color,
  });
});

// @desc        Delete color
// @route       DELETE /api/colors/:id
// @access      Private/Admin
export const deleteColorCtrl = asyncHandler(async (request, response) => {
  await Color.findByIdAndDelete(request.params.id);
  response.json({
    status: "success",
    message: "Color deleted successfully",
  });
});
