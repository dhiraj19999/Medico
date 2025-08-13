import express from "express";
import { findNearby } from "../controllers/nearbyPharmacyController.js";

const router = express.Router();

router.post("/", findNearby); // photo field  // done


export default router;
