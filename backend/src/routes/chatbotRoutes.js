import express from "express";
import {chatWithAI,getChatHistory} from "../controllers/chatbotController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",protect, chatWithAI);
router.get("/",protect,getChatHistory)
export default router;
