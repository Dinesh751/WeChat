import app from './app.js';
import dotenv from 'dotenv';
import {  logger } from './utils/logger.cjs'; // Import the error logger
import connectToDb from './config/db.config.js'; // Import database connection

// Load environment variables
dotenv.config();

// Connect to the database
connectToDb();

const PORT = process.env.PORT || 8081;


// Global error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(err.message, { stack: err.stack }); // Log the error
  process.exit(1); // Exit the process to avoid undefined behavior
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Global error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(reason); // Log the rejection reason
  server.close(() => {
    process.exit(1); // Exit the process after closing the server
  });
});
