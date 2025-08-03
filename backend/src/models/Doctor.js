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
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    }
  },
  availableDays: [String], // e.g. ["Monday", "Wednesday"]
  availableTime: {
    start: String, // e.g. "09:00"
    end: String,   // e.g. "17:00"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



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

