// routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser,getUserProfile,logoutUser,getAlluser,deleteUser,searchUser } from '../controllers/authController.js';
import upload from '../middleware/upload.js';
import { protect,isAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();


router.post("/register",upload.single("avatar"), registerUser);  //  done
router.post('/login', loginUser);  // done

router.get("/user",protect, getUserProfile);  // done
router.post("/logout",protect, logoutUser);  // done
router.get("/alluser",protect,isAdmin,getAlluser) // done
router.delete("/delete/:id",protect,isAdmin,deleteUser) // done
router.post("/search/",protect,isAdmin,searchUser)


export default router;
