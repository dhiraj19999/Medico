import VideoConsultation from "../models/VideoConsultation";

import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const { patient, doctor, scheduledDate, scheduledTime } = req.body;
    const meetingLink = `https://healix.com/meet/${uuidv4()}`;

    const booking = await VideoConsultation.create({
      patient,
      doctor,
      scheduledDate,
      scheduledTime,
      meetingLink
    });

    // Send Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "patient@example.com", // fetch from DB
      subject: "Video Consultation Booking",
      html: `<p>Your meeting link: <a href="${meetingLink}">${meetingLink}</a></p>`
    });

    // TODO: Send WhatsApp using API

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Submit Feedback
export const submitFeedback = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { rating, comment } = req.body;

    const consultation = await VideoConsultation.findByIdAndUpdate(
      consultationId,
      { feedback: { rating, comment }, status: "completed" },
      { new: true }
    );

    res.status(200).json({ success: true, consultation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Upcoming & Past Consultations
export const getConsultations = async (req, res) => {
  try {
    const { userId, role } = req.params; // role: patient/doctor

    let filter = {};
    if (role === "patient") filter.patient = userId;
    else if (role === "doctor") filter.doctor = userId;

    const upcoming = await VideoConsultation.find({ ...filter, status: { $in: ["pending", "confirmed"] } })
      .populate("doctor patient", "name email");
    const past = await VideoConsultation.find({ ...filter, status: "completed" })
      .populate("doctor patient", "name email feedback");

    res.status(200).json({ success: true, upcoming, past });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};