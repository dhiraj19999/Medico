import express from "express";
import { uploadReport, getUserReports, downloadReport,downloadReportSummary,deleteReport} from "../controllers/reportUploadController.js";
import upload from "../middleware/upload.js";
import {protect} from "../middleware/authMiddleware.js"; // tu ka auth

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadReport);  // done
router.get("/", protect, getUserReports);  // done
router.get("/download/:id", protect, downloadReport);  // done
router.get("/summary/:id", protect, downloadReportSummary);  // done
router.delete("/:id", protect, deleteReport);  // done

export default router;
