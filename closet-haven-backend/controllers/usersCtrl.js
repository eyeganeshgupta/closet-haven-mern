import User from "../model/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

// @desc Register user
// @route POST /api/v1/users/register
// @access Private/Admin

export const registerUserCtrl = asyncHandler(async (request, response) => {
  const { fullname, email, password } = request.body;
  // check user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    // throw error
    throw new Error("User already exists");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // register the user
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  });

  response.status(201).json({
    status: "success",
    message: "User Registered Successfully",
    data: user,
  });
});

// @desc Login User
// @route POST /api/v1/users/login
// @access Public

export const loginUserCtrl = asyncHandler(async (request, response) => {
  const { email, password } = request.body;
  // Find the user in database by using email
  const userFound = await User.findOne({
    email,
  });

  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    response.json({
      status: "success",
      message: "User LoggedIn Successfully",
      userFound,
      token: generateToken(userFound?._id),
    });
  } else {
    throw new Error("Invalid Login Credentials");
  }
});

// @desc Get user profile
// @route GET /api/v1/users/profile
// @access Private

export const getUserProfileCtrl = asyncHandler(async (request, response) => {
  // getting token from header
  const token = getTokenFromHeader(request);
  // verify token
  const verified = verifyToken(token);
  console.log(verified);
  response.json({
    msg: "Welcome to Profile Page",
  });
});
