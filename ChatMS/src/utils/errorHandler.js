import { sendErrorResponse } from './response.js';

// Centralized error handler middleware
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  // Send error response
  sendErrorResponse(res, err.message || 'Internal Server Error', {
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  }, statusCode);
};

// Utility function to create custom errors
export const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};