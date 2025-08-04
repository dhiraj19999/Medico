import mongoose from "mongoose";



const HealthReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  age: Number,
  gender: String,
  bp: String,
  sugar: String,
  cholesterol: String,
  heartRate: String,
  weight: Number,
  height: Number,
  symptoms: String, // 👈 New field
  riskResult: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("HealthReport", HealthReportSchema);

