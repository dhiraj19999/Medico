// routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser,getUserProfile,logoutUser } from '../controllers/authController.js';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post("/register",upload.single("avatar"), registerUser);
router.post('/login', loginUser);

router.get("/user",protect, getUserProfile);
router.post("/logout",protect, logoutUser);

export default router;
