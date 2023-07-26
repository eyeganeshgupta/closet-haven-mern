import User from "../model/User.js";

const isAdmin = async (request, response, next) => {
  // find the login user
  const user = await User.findById(request.userAuthId);

  // check if admin
  if (user.isAdmin) {
    next();
  } else {
    next(new Error("Access Denied, Admin Only!"));
  }
};

export default isAdmin;
