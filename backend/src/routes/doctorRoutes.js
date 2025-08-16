import express from "express";
import { registerDoctor, loginDoctor,getNearbyDoctors,searchDoctors} from "../controllers/doctorController.js";
import upload from "../middleware/upload.js"; // for Cloudinary image upload
import { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register",upload.single("avatar"), registerDoctor); // photo field done
router.post("/login", loginDoctor);
router.get("/nearbydoc", getNearbyDoctors);
router.post("/search", searchDoctors);
export default router;
