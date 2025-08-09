// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  phone: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'other'
  },

  dateOfBirth: {
    type: String
  },

  address: {
    type: String
  },

  avatar: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  },

  role: {
    type: String,
   default: 'patient'
  },

   subscription:{
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
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

  healthRecords: [
    {
      fileUrl: String,
      title: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 🔐 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔐 Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🌐 Enable 2dsphere index for location queries
userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);

export default User;
