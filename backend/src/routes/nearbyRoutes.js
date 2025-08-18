import express from "express";
import { findNearby } from "../controllers/nearbyPharmacyController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/",protect, findNearby); // photo field  // done


export default router;
