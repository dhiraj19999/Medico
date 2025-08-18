// models/VideoAppointment.js
import mongoose from "mongoose";

const videoAppointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
    default: "Pending",
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
  },
  feedback: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feedback",
  },
  cancelReason: {
    type: String,
    default: "",
  },
  aiSummary: {
    type: String,
    default: "", // AI will fill this after completion
  },
  videoRoomId: {
    type: String,
    required: true, // unique room for this appointment
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  videoLink: {
  type: String,
  default: "", // auto-generate when booked
},
linkExpiresAt: {
  type: Date, // 30 min after appointment time
},
linkActive: {
  type: Boolean,
  default: false, // only true during appointment time window
}
});

export default mongoose.model("VideoAppointment", videoAppointmentSchema);
