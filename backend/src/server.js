// server.js
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";



import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from "./routes/doctorRoutes.js"
import appointmentRoutes from "./routes/appointmentRoutes.js"
 import chatbotRoutes from "./routes/chatbotRoutes.js"
 import nearByPharmacy from "./routes/nearbyRoutes.js"
 import healthReport from "./routes/healthreportRoutes.js"
dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight handle
app.options("*", cors({
   origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/nearby', nearByPharmacy);
app.use('/api/health', healthReport);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
