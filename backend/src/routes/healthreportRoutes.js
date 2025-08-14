import express from "express";

import {analyzeHealthRisk,getHealthReports,getHealthTrends,getHealthReportPdfById} from "../controllers/healthRiskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/predict",protect, analyzeHealthRisk);  // done
router.get("/reports",protect, getHealthReports);  // done
router.get("/trends",protect, getHealthTrends);   // done
router.get("/reports/:reportId",protect, getHealthReportPdfById); // done


export default router;