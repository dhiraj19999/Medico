import express from "express"
const router = express.Router();
import { getAIHealthJourney } from "../controllers/SuperAnylatics.js";
import { protect } from "../middleware/authMiddleware.js";



router.get("/",protect, getAIHealthJourney); 


export default router;