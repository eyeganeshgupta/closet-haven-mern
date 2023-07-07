export const globalErrHandler = (error, request, response, next) => {
  // stack about the error
  const stack = error?.stack;
  // messsage
  const message = error?.message;

  response.json({
    stack,
    message,
  });
};
