import express from "express"
import { verifyToken } from "../middleware/verifyToken.js";
import { getAllUserController } from "../controllers/user.controller.js";

const router=express.Router();

router.get('/',verifyToken,getAllUserController)

export default router;