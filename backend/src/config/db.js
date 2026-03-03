
import mongoose from 'mongoose';
import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Mongo Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

