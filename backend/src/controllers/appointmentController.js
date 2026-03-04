
import Appointment from "../models/Appointment.js";
import nodemailer from "nodemailer"


import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import Hospital from "../models/Hospital.js";

export const bookAppointment = async (req, res) => {
  try {
    const { doctor, date, time, reason, hospital } = req.body;
    const userId = req.user._id;

    if (!doctor || !date || !time) {
      return res.status(400).json({ message: "Doctor, date and time are required" });
    }

    const [hours, minutes] = time.split(":");
    const dat = new Date(date);
    dat.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const doctorData = await Doctor.findById(doctor);
    if (!doctorData) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const appointment = await Appointment.create({
      user: userId,
      doctor,
      date,
      time: dat,
      reason,
      hospital: hospital || null
    });

    doctorData.appointments.push(appointment._id);
    await doctorData.save();

    userData.appointments.push(appointment._id);
    await userData.save();

    let hospitalData = null;

    if (hospital) {
      hospitalData = await Hospital.findById(hospital);

      if (hospitalData) {
        hospitalData.appointment.push(appointment._id);

        if (!hospitalData.doctors.includes(doctor)) {
          hospitalData.doctors.push(doctor);
        }

        await hospitalData.save();

        if (!doctorData.hospitals.includes(hospital)) {
          doctorData.hospitals.push(hospital);
          await doctorData.save();
        }
      }
    }

    // EMAIL SEND (SAFE MODE)
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const formatTime = (d) => {
          let h = d.getHours();
          let m = d.getMinutes();
          const ampm = h >= 12 ? "PM" : "AM";
          h = h % 12 || 12;
          m = m.toString().padStart(2, "0");
          return `${h}:${m} ${ampm}`;
        };

        await transporter.sendMail({
          from: `"Healix" <${process.env.EMAIL_USER}>`,
          to: userData.email,
          subject: "Appointment Booked",
          html: `
          <h2>Appointment Details</h2>
          <p>Doctor: ${doctorData.name}</p>
          <p>Hospital: ${hospitalData?.name || "N/A"}</p>
          <p>Date: ${new Date(date).toLocaleDateString()}</p>
          <p>Time: ${formatTime(dat)}</p>
          <p>Reason: ${reason || "Not specified"}</p>
          `
        });

      }
    } catch (emailError) {
      console.log("Email failed but booking success:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment
    });

  } catch (err) {
    console.error("BOOK ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
// 👤 Get Appointments for Logged-in User
export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate("doctor").populate("hospital").populate("feedback")
      .sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👨‍⚕️ Get Appointments for Doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id }).populate("user")
    .populate("hospital").populate("feedback")
      
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  modify appointment status 

export const modifyAppointmentStatus = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const {newStatus,reason,userId} = req.body;
    let updatedAppointment;
 const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // sender email
        pass: process.env.EMAIL_PASS, // app password
      },
    })
     const userData= await User.findById(userId)
     const doctorData=await Doctor.findById(req.user._id)
    const appointment = await Appointment.findById(appointmentId).populate("hospital");
     const hospitalData=appointment.hospital

    
    if(reason && newStatus==="Cancelled"){
updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: newStatus,cancelReason:reason },
      { new: true } 
    );
    const mailOptions = {
      from: `"Healix" <${process.env.EMAIL_USER}>`,
      to: userData.email,
      subject: "Your Appointment Status",
      html: `
        <h2>Appointment Details</h2>
        <p>Dear ${userData.name},</p>
       <p>We regret to inform you that your appointment has been cancelled by the doctor. We sincerely apologize for any inconvenience this may have caused.</p>

        <h3>Details:</h3>
        <ul>
          <li><b>Doctor Name:</b> ${doctorData.name} </li>
           <li><b>Doctor Phone and Email:</b>  ${doctorData.phone || "N/A"} (${doctorData.email ||  "N/A"})</li>
          <li><b>Hospital Name:</b> ${hospitalData?.name || "N/A"} </li>
            <li><b>Hospital Phone and Email:</b> ${hospitalData?.phone || "N/A"} ${hospitalData.gmail || "N/A"}</li>
          <li><b>Hospital City:</b> ${hospitalData?.city || ""}, ${hospitalData?.state || ""}</li>
          <li><b>Hospital Address:</b> ${hospitalData?.streetAdd || "NA"}</li>
          <li><b>Date:</b> ${appointment.date}</li>
          <li><b>Time:</b> ${appointment.time}</li>
           <li><b>Appointment Reason:</b> ${appointment.reason}</li>
          <li><b>Reason For Cancellation:</b> ${reason || "Not specified"}</li>
        </ul>
        <p>Thank you for choosing our service.</p>
      `,
    };
await transporter.sendMail(mailOptions);
    }else if(newStatus=="Confirmed"){
       updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: newStatus },
      { new: true } 
    );

 const mailOptions = {
      from: `"Healix" <${process.env.EMAIL_USER}>`,
      to: userData.email,
      subject: "Your Appointment Status",
      html: `
        <h2>Appointment Details</h2>
        <p>Dear ${userData.name},</p>
     <p>We are pleased to inform you that your appointment has been successfully confirmed by the doctor. Kindly visit the hospital on the scheduled date and time.</p>

        <h3>Details:</h3>
        <ul>
          <li><b>Doctor Name:</b> ${doctorData.name} </li>
           <li><b>Doctor Phone and Email:</b>  ${doctorData.phone || "N/A"} (${doctorData.email ||  "N/A"})</li>
          <li><b>Hospital Name:</b> ${hospitalData?.name || "N/A"} </li>
            <li><b>Hospital Phone and Email:</b> ${hospitalData?.phone || "N/A"} ${hospitalData?.gmail || "N/A"}</li>
          <li><b>Hospital City:</b> ${hospitalData?.city || ""}, ${hospitalData?.state || ""}</li>
          <li><b>Hospital Address:</b> ${hospitalData?.streetAdd || "NA"}</li>
          <li><b>Date:</b> ${appointment.date}</li>
          <li><b>Time:</b> ${appointment.time}</li>
          <li><b>Reason For appointment:</b> ${appointment.reason || "Not specified"}</li>
        </ul>
        <p>Thank you for choosing our service.</p>
      `,
    };
await transporter.sendMail(mailOptions);
    }
    
    res.json({message: "Appointment status changed successfully", appointment: updatedAppointment});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
