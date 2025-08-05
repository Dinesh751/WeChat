import express from "express"
import { getChatController, saveChatController } from "../controllers/conversation.controller.js";


const route=express.Router();

route.get("/",getChatController);
route.post("/", saveChatController); // Route to save chat to the database

export default route;