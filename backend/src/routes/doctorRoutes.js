import express from "express";
import { registerDoctor, loginDoctor,getNearbyDoctors,searchDoctors,getAllDoctors,getDoctorInsights,getDoctorAdminsideInsights} from "../controllers/doctorController.js";
import upload from "../middleware/upload.js"; // for Cloudinary image upload
import { isAdmin,protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register",protect,isAdmin,upload.single("avatar"), registerDoctor); // photo field done // admin access only
router.post("/login", loginDoctor); // doctor
router.get("/nearbydoc",protect, getNearbyDoctors);
router.post("/search",protect, searchDoctors); // all
router.get("/all", protect, getAllDoctors); // for all
router.get("/insights",protect, getDoctorInsights);
router.get("/adminsideinsights/:doctorId",protect, isAdmin, getDoctorAdminsideInsights);
export default router;
