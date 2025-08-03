import Doctor from "../models/Doctor.js";
import jwt from "jsonwebtoken";

// JWT Generate
const generateToken = (id) =>
  jwt.sign({ id, role: "doctor" }, process.env.JWT_SECRET, { expiresIn: "7d" });

// 🔐 Admin-only Doctor Register
export const registerDoctor = async (req, res) => {
  try {
    const {
      name, specialization, qualifications, experience, email, phone,
      gender, address, availableDays, availableTime,password
    } = req.body;

    const existing = await Doctor.findOne({ email });
    if (existing) return res.status(400).json({ message: "Doctor already exists" });

    const avatar = req.file?.path || ""; // from multer-cloudinary

    const doctor = await Doctor.create({
      name,
      specialization,
      qualifications,
      experience,
      email,
      phone,
      gender,
      avatar,
      address,
      availableDays,
      availableTime,
      password
    });


    res.status(201).json({
      _id: doctor._id,
      name: doctor.name,
      token: generateToken(doctor._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔐 Doctor Login
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await doctor.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });
res.cookie("token", generateToken(doctor._id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      _id: doctor._id,
      name: doctor.name,
      token: generateToken(doctor._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
