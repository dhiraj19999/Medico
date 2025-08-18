// routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser,getUserProfile,logoutUser } from '../controllers/authController.js';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();


router.post("/register",upload.single("avatar"), registerUser);  //  done
router.post('/login', loginUser);  // done

router.get("/user",protect, getUserProfile);  // done
router.post("/logout",protect, logoutUser);  // done

export default router;
