// routes/appointmentRoutes.js
import express from "express";
import {
  bookAppointment,
  getUserAppointments,
  getDoctorAppointments,
  modifyAppointmentStatus
} from "../controllers/appointmentController.js";
import { protect, isDoctor } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🩺 Routes
router.post("/book", protect, bookAppointment); // user booking done fronned also done
router.get("/getappointments", protect, getUserAppointments); // user viewing
router.get("/doctor", protect,isDoctor, getDoctorAppointments); // doctor viewing
router.put("/modify/:id", protect,isDoctor, modifyAppointmentStatus); // doctor modifying

export default router;
