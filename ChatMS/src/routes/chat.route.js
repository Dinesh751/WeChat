import express from 'express';
import { getHealthStatus } from '../controllers/health.controller.js'; // Health controller
import {
  addMsgToConversation,
  getChatController,
} from '../controllers/chat.controller.js'; // Chat controllers

const router = express.Router();

// Health Check Route
router.get('/health', getHealthStatus);

// Chat Routes
router.post('/message', addMsgToConversation); // Add a message to a conversation
router.get('/conversation', getChatController); // Get a conversation between two users

export default router;