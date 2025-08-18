import { addFeedback } from "../controllers/feedbackcontroller.js";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();


router.post("/add",protect, addFeedback);  // for all

export default router;