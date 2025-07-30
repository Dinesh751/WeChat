import { logger } from "../utils/logger.cjs";
import { sendSuccessResponse, sendErrorResponse } from "../utils/response.js";
import {
  addMessageToConversation,
  getConversation,
} from "../services/chat.service.js";

// Add a message to a conversation
export const addMsgToConversation = async (req, res) => {
  try {
    const { participants, msg } = req.body;

    // Validate input
    if (!participants || participants.length !== 2 || !msg) {
      return sendErrorResponse(res, "Invalid input. Participants and message are required.", {}, 400);
    }

    // Add the message to the conversation
    await addMessageToConversation(participants, msg);

    logger.info(`Message added to conversation between ${participants.join(", ")}`);
    return sendSuccessResponse(res, "Message added successfully", {}, 200);
  } catch (err) {
    logger.error("Error adding message to conversation:", err);
    return sendErrorResponse(res, "Something went wrong while adding the message", { error: err.message }, 500);
  }
};

// Get a conversation between two users
export const getChatController = async (req, res) => {
  try {
    const { sender, receiver } = req.query;

    // Validate input
    if (!sender || !receiver) {
      return sendErrorResponse(res, "Sender and receiver are required", {}, 400);
    }

    // Fetch the conversation
    const chat = await getConversation(sender, receiver);

    if (!chat) {
      return sendErrorResponse(res, "No chat found between the specified users", {}, 404);
    }

    logger.info(`Chat fetched successfully between ${sender} and ${receiver}`);
    return sendSuccessResponse(res, "Chat fetched successfully", { chat }, 200);
  } catch (err) {
    logger.error("Error fetching chat:", err);
    return sendErrorResponse(res, "Something went wrong while fetching the chat", { error: err.message }, 500);
  }
};

