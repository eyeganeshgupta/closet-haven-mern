export const getTokenFromHeader = (request) => {
  const token = request?.headers?.authorization?.split(" ")[1];
  if (token === undefined) {
    return "No token found in the header";
  }
  return token;
};
