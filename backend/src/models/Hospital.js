import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  specialization: {
    type: [String], // Hospital ke specialties (e.g., Cardiology, Neurology)
    default: [],
  },
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor", // Doctor collection ka reference
    },
  ],
  appointment:[{type:mongoose.Schema.Types.ObjectId,ref:"Appointment"}],
  
  phone: { type: String, default: "" ,minlength: 10, maxlength: 10},
  gmail: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  pincode: { type: String, default: "" },
  rating: {
    type: Number,
    default: 4.5,
  },
  avatar: {
    type:String,
    default:""
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  streetAdd:{
    type:String,
    default:""
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Hospital", hospitalSchema);
