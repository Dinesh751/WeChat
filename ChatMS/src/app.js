import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './utils/errorHandler.js';
import { logger } from './utils/logger.cjs';
import chatRoutes from './routes/chat.route.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Chat routes
app.use('/v1/api/chat', chatRoutes);

// 404 Not Found handler
app.use((req, res, next) => {
  logger.error(`404 Not Found - ${req.method} ${req.url}`); // Log 404 errors
  res.status(404).json({ message: 'Not Found' });
});

// Global Error Handling
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack }); // Log the error
  errorHandler(err, req, res, next); // Use the existing error handler
});

export default app;
