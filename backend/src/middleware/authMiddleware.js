// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
/*
export const protect = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (excluding password)
    req.user = await User.findById(decoded.id).select("-password");

    next(); // proceed to next middleware or route
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};*/
export const protect = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try finding in User collection
    let account = await User.findById(decoded.id).select("-password");

    // If not found in User, try in Doctor
    if (!account) {
      account = await Doctor.findById(decoded.id).select("-password");
    }

    // If still not found
    if (!account) {
      return res.status(401).json({ message: "Not authorized, account not found" });
    }

    // Attach account (user or doctor) to request
    req.user = account
    next();
  } catch (err) {
    console.error("Auth error:", err);
     if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export const protectDoctor= async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (excluding password)
    req.doctor = await Doctor.findById(decoded.id).select("-password");

    next(); // proceed to next middleware or route
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};





export const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin")
      return res.status(403).json({ message: "Not authorized as admin" });

    req.user = user;
    next();
  } catch (err) {
     if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};

export const isDoctor = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const doctor = await Doctor.findById(decoded.id);
    if (!doctor || doctor.role !== "doctor")
      return res.status(403).json({ message: "Not authorized as doctor" });
    req.doctor = doctor;
    next();
  } catch (err) {
     if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};