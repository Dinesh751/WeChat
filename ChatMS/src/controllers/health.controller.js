import mongoose from 'mongoose';
// import redisClient from '../config/redis.config.js'; // Uncomment if Redis is implemented

export const getHealthStatus = async (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  const redisStatus = "Not implemented yet"; // Update this when Redis is implemented

  res.status(200).json({
    status: 'OK',
    database: dbState,
    redis: redisStatus,
    timestamp: new Date().toISOString(),
  });
};