import express from "express"
import { getChatController } from "../controllers/conversation.controller.js";


const route=express.Router();

route.get("/",getChatController);

export default route;