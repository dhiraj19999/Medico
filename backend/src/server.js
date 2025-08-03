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
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/nearby', nearByPharmacy);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
