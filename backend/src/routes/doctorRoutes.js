import express from "express";
import { registerDoctor, loginDoctor } from "../controllers/doctorController.js";
import upload from "../middleware/upload.js"; // for Cloudinary image upload
import { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", isAdmin, upload.single("avatar"), registerDoctor); // photo field
router.post("/login", loginDoctor);

export default router;
