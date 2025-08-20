// server.js
import express from "express"
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import https from 'https';
import fs from 'fs';
import path from "path";

import "./scheduler/autoCompleteAppointments.js"
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from "./routes/doctorRoutes.js"
import appointmentRoutes from "./routes/appointmentRoutes.js"
 import chatbotRoutes from "./routes/chatbotRoutes.js"
 import nearByPharmacy from "./routes/nearbyRoutes.js"
 import healthReport from "./routes/healthreportRoutes.js"
import uploadReport from "./routes/uploadreportRoutes.js"
import superAnylatic from "./routes/superanaylaticsRoutes.js"
import hospital from "./routes/hospitalRoutes.js"
import feedbackRoute from "./routes/feedbackRoute.js"





dotenv.config();
connectDB();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://healix-frontend-kappa.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Explicitly handle preflight
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Preflight handle


app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/nearby', nearByPharmacy);
app.use('/api/health', healthReport);
app.use('/api/reports', uploadReport);
app.use('/api/superanalytics', superAnylatic);
app.use('/api/hospital', hospital);
app.use('/api/feedback', feedbackRoute);



// Redoc UI serve karne ke liye




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

