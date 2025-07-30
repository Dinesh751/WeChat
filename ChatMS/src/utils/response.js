// Utility for sending success responses
export const sendSuccessResponse = (res, message, data = {}, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Utility for sending error responses
export const sendErrorResponse = (res, message, error = {}, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};