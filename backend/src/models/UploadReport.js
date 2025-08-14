import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  filename: { type: String},
  contentType: { type: String },
  summary: { type: String },
  file: { type: Buffer},
    createdAt: { type: Date, default: Date.now }

},

);

export default mongoose.model("Report", reportSchema);
