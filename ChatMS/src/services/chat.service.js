import conversation from "../models/message.model.js";

// Find or create a conversation
export const findOrCreateConversation = async (participants) => {
  let conver = await conversation.findOne({ users: { $all: participants } });
  if (!conver) {
    conver = await conversation.create({ users: participants });
  }
  return conver;
};

// Add a message to a conversation
export const addMessageToConversation = async (participants, msg) => {
  const conver = await findOrCreateConversation(participants);
  conver.msgs.push(msg);
  await conver.save();
  return conver;
};

// Fetch a conversation between two users
export const getConversation = async (sender, receiver) => {
  return await conversation.findOne({ users: { $all: [sender, receiver] } }).lean();
};
