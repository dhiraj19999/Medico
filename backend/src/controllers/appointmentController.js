// controllers/appointmentController.js
import Appointment from "../models/Appointment.js";

// 📅 Book Appointment (User)
export const bookAppointment = async (req, res) => {
  try {
    const { doctor, date, time, reason } = req.body;

    const appointment = await Appointment.create({
      user: req.user._id,
      doctor,
      date,
      time,
      reason,
    });

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👤 Get Appointments for Logged-in User
export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate("doctor", "name specialization")
      .sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👨‍⚕️ Get Appointments for Doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.doctor._id })
      .populate("user", "name email phone")
      .sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
