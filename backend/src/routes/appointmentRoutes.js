// routes/appointmentRoutes.js
import express from "express";
import {
  bookAppointment,
  getUserAppointments,
  getDoctorAppointments,
} from "../controllers/appointmentController.js";
import { protect, protectDoctor } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🩺 Routes
router.post("/book", protect, bookAppointment); // user booking
router.get("/getappointments", protect, getUserAppointments); // user viewing
router.get("/doctor", protectDoctor, getDoctorAppointments); // doctor viewing

export default router;
