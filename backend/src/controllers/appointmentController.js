// controllers/appointmentController.js
import Appointment from "../models/Appointment.js";
import nodemailer from "nodemailer"
// 📅 Book Appointment (User)

import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import Hospital from "../models/Hospital.js";

export const bookAppointment = async (req, res) => {
  try {
    const { doctor, date, time, reason, hospital } = req.body;
    const userId = req.user._id;

    const timeString = time // HH:mm format
const [hours, minutes] = timeString.split(":");
const dat= new Date();
dat.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Basic validation
    if (!doctor || !date || !time) {
      return res.status(400).json({ message: "Doctor, date and time are required" });
    }

    // Check doctor exists
    const doctorData = await Doctor.findById(doctor);
    if (!doctorData) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check user exists
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create appointment
    const appointment = await Appointment.create({
      user: userId,
      doctor,
      date,
      time:dat,
      reason,
      hospital: hospital || null
    });

    // Push appointment into doctor
    doctorData.appointments.push(appointment._id);
    await doctorData.save();

    // Push appointment into user
    userData.appointments.push(appointment._id);
    await userData.save();

    // If hospital is provided, update hospital relations
    if (hospital) {
      const hospitalData = await Hospital.findById(hospital);
      if (hospitalData) {
        // Push appointment to hospital
        hospitalData.appointment.push(appointment._id);

        // Ensure doctor is linked to hospital (if not already)
        if (!hospitalData.doctors.includes(doctor)) {
          hospitalData.doctors.push(doctor);
        }

        await hospitalData.save();

        // Ensure hospital is linked to doctor (if not already)
        if (!doctorData.hospitals.includes(hospital)) {
          doctorData.hospitals.push(hospital);
          await doctorData.save();
        }
      }
    }

      const hospitalData=await  Hospital.findById(hospital)
         // Send email to user 
          const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // sender email
        pass: process.env.EMAIL_PASS, // app password
      },
    })

     const formatTimeTo12Hour = (date) => {
      let hrs = date.getHours();
      let mins = date.getMinutes();
      const ampm = hrs >= 12 ? "PM" : "AM";
      hrs = hrs % 12 || 12;
      mins = mins.toString().padStart(2, "0");
      return `${hrs}:${mins} ${ampm}`;
    };

    const appointmentTime = formatTimeTo12Hour(dat);
    const appointmentDate = new Date(date).toLocaleDateString();

const mailOptions = {
      from: `"Healix" <${process.env.EMAIL_USER}>`,
      to: userData.email,
      subject: "Your Appointment Details",
      html: `
        <h2>Appointment Details</h2>
        <p>Dear ${userData.name},</p>
        <p>Your appointment has been successfully booked and is currently pending approval. We will send you a confirmation email as soon as the doctor approves your appointment. Thank you for your patience..</p>
        <h3>Details:</h3>
        <ul>
          <li><b>Doctor Name:</b> ${doctorData.name} </li>
           <li><b>Doctor Phone and Email:</b>  ${doctorData.phone || "N/A"} (${doctorData.email ||  "N/A"})</li>
          <li><b>Hospital Name:</b> ${hospitalData?.name || "N/A"} (${hospitalData?.phone || "N/A"})</li>
            <li><b>Hospital Phone and Email:</b> ${hospitalData?.phone || "N/A"} (${hospitalData?.gmail || "N/A"})</li>
          <li><b>Hospital City:</b> ${hospitalData?.city || ""}, ${hospitalData?.state || ""}</li>
          <li><b>Hospital Address:</b> ${hospitalData?.streetAdd || "NA"},  }</li>
          <li><b>Date:</b> ${appointmentDate}</li>
          <li><b>Time:</b> ${appointmentTime}</li>
          <li><b>Reason:</b> ${reason || "Not specified"}</li>
        </ul>
        <p>Thank you for choosing our service.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully and email sent to you",
      appointment
    });

  } catch (err) {
    console.error("Error booking appointment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 👤 Get Appointments for Logged-in User
export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate("doctor").populate("hospital")
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
       .populate({
        path: "doctor",
        select: "name hospitals",
        populate: {
          path: "hospitals",
          select: "name city"
        }
      })
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
