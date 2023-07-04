import User from "../model/User.js";

// @desc Register user
// @route POST /api/v1/users/register
// @access Private/Admin

export const registerUserCtrl = async (request, response) => {
  const { fullname, email, password } = request.body;
  // check user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    // throw error
    response.json({
      msg: "User already exists",
    });
  }
  // hash password
  // register the user
  const user = await User.create({
    fullname,
    email,
    password,
  });

  response.status(201).json({
    status: "success",
    message: "User Registered Successfully",
    data: user,
  });
};
