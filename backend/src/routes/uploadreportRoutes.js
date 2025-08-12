import express from "express";
import { uploadReport, getUserReports, downloadReport,downloadReportSummary} from "../controllers/reportUploadController.js";
import upload from "../middleware/upload.js";
import {protect} from "../middleware/authMiddleware.js"; // tu ka auth

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadReport);
router.get("/", protect, getUserReports);
router.get("/download/:id", protect, downloadReport);
router.get("/summary/:id", protect, downloadReportSummary);

export default router;
