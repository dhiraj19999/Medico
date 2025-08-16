// models/Doctor.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  qualifications: {
    type: String,
    required: true,
  },
  experience: {
    type: Number, // in years
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
 password: {
    type: String,
    required: true,
    minlength: 6
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  rating:[{type:Number}],

  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  avatar: {
    type: String, // Cloudinary image URL
    default: "",
  },
  address: {
    city: String,
    state: String,
    country: String,
    pincode: String,
   
  },
 
  appointments:[{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  }],
  hospitals:[{type:mongoose.Schema.Types.ObjectId,ref:'Hospital'}],
  availableDays: [String], // e.g. ["Monday", "Wednesday"]
  availableTime: {
    start: String, // e.g. "09:00"
    end: String,   // e.g. "17:00"
  },
   location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  role:{
    type: String,
    enum: ['doctor', 'admin'],
    default: 'doctor'
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

doctorSchema.index({ location: "2dsphere" });

doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔐 Compare password method
doctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
doctorSchema.index({ "address.location": "2dsphere" });

// 🌐 Enable 2dsphere index for location queries
//doctorSchema.index({ location: '2dsphere' });

export default mongoose.model("Doctor", doctorSchema);

