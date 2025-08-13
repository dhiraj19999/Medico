import express from "express";
import {chatWithAI,getChatHistory} from "../controllers/chatbotController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",protect, chatWithAI); // done
router.get("/",protect,getChatHistory)  // done
export default router;
