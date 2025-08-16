// routes/appointmentRoutes.js
import express from "express";
import {
  bookAppointment,
  getUserAppointments,
  getDoctorAppointments,
  modifyAppointmentStatus
} from "../controllers/appointmentController.js";
import { protect, protectDoctor } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🩺 Routes
router.post("/book", protect, bookAppointment); // user booking done fronned also done
router.get("/getappointments", protect, getUserAppointments); // user viewing
router.get("/doctor", protect, getDoctorAppointments); // doctor viewing
router.put("/modify/:id", protect, modifyAppointmentStatus); // doctor modifying

export default router;
