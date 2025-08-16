import Feedback from "../models/Feedback.js";

import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";


export const addFeedback=async (req,res)=>{
try {
    
 const {doctorId,feedbackRating,doctorRating,comment,appointmentId} = req.body;
    const userId = req.user._id; // assuming user is authenticated

   // 1️⃣ Check appointment exists
    const appointment = await Appointment.findById(appointmentId);
     if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // 2️⃣ Create feedback
    const feedback=await Feedback.create({
    
         doctor:doctorId,
         user:userId,
         rating:feedbackRating,
         comment:comment,
         appointment:appointmentId




    })
 // 3️⃣ Update appointment with feedback ID
    appointment.feedback=feedback._id
    await appointment.save()

// 4️⃣ Push rating to doctor's rating array
const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    doctor.rating.push(doctorRating);
    await doctor.save();
    
res.status(201).json({
      message: "Feedback added successfully",
      feedback,
    });

} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
}
  


}