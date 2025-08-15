import Doctor from "../models/Doctor.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
// JWT Generate
const generateToken = (id) =>
  jwt.sign({ id, role: "doctor" }, process.env.JWT_SECRET, { expiresIn: "7d" });

// 🔐 Admin-only Doctor Register


export const registerDoctor = async (req, res) => {
  try {
    const {
      name, specialization, qualifications, experience,
      email, phone, password, gender,
      city, state, country, pincode,
      availableDays, availableTimeStart, availableTimeEnd, location
    } = req.body;

    const existing = await Doctor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    // Parse availableDays
    let parsedDays = Array.isArray(availableDays) ? availableDays : [];
    if (typeof availableDays === "string") {
      try { parsedDays = JSON.parse(availableDays); } catch {}
    }

    // Parse location
    let parsedLocation = { type: "Point", coordinates: [0, 0] };
    if (location) {
      if (typeof location === "string") {
        try { parsedLocation = JSON.parse(location); } catch {}
      } else if (typeof location === "object") {
        parsedLocation = location;
      }
    }

    if (!parsedLocation.coordinates || parsedLocation.coordinates.length !== 2) {
      return res.status(400).json({ message: "Invalid location coordinates" });
    }

    // Avatar Upload
    let avatarUrl = "";
    if (req.file) {
      const base64Str = req.file.buffer.toString("base64");
      const dataUri = `data:${req.file.mimetype};base64,${base64Str}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "user-profiles",
        width: 400, height: 400, crop: "limit",
        fetch_format: "auto", quality: "auto",
      });
      avatarUrl = result.secure_url;
    }

    // Create doctor
    const doctor = await Doctor.create({
      name,
      specialization,
      qualifications,
      experience,
      email,
      phone,
      password,
      gender,
      avatar: avatarUrl,
      address: { city, state, country, pincode },
      availableDays: parsedDays,
      availableTime: { start: availableTimeStart, end: availableTimeEnd },
      location: parsedLocation
    });

    res.status(201).json({
      _id: doctor._id,
      name: doctor.name,
      token: generateToken(doctor._id),
    });

  } catch (error) {
    console.error("Doctor Registration Error:", error);
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



export const getNearbyDoctors = async (req, res) => {
  try {
    const { latitude, longitude } = req.query; // frontend se bhejo
    console.log("Latitude:", latitude, "Longitude:", longitude);
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and Longitude required" });
    }

    const nearbyDoctors = await Doctor.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: 50000 // 50 km = 50,000 meters
        }
      }
    }).select("-password").populate("hospitals");

    res.json({ success: true, data: nearbyDoctors });
  } catch (error) {
    console.error("Error finding nearby doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
};