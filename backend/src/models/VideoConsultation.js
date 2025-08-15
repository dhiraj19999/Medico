import mongoose from 'mongoose'

const videoConsultationSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String, required: true }, // e.g., "14:30"
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  meetingLink: { type: String }, // unique room ID
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('VideoConsultation', videoConsultationSchema);
