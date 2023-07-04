import User from "../model/User.js";

// @desc Register user
// @route POST /api/v1/users/register
// @access Private/Admin

export const registerUserCtrl = async (request, response) => {
  response.json({
    msg: "User register controller",
  });
};
