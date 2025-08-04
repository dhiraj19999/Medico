import express from "express";

import {analyzeHealthRisk,getHealthReports,getHealthTrends,getHealthReportPdfById} from "../controllers/healthRiskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/predict",protect, analyzeHealthRisk);
router.get("/reports",protect, getHealthReports);
router.get("/trends",protect, getHealthTrends);
router.get("/reports/:reportId",protect, getHealthReportPdfById);


export default router;