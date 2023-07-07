export const globalErrHandler = (error, request, response, next) => {
  // stack about the error
  const stack = error?.stack;
  // statusCode
  const statusCode = error?.statusCode ? error?.statusCode : 500;
  // messsage
  const message = error?.message;

  response.status(statusCode).json({
    stack,
    message,
  });
};
