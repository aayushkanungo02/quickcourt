import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
    console.log(`mongoDb ${conn.connection.host}:${conn.connection.port}`);
    console.log(`mongoDb ${conn.connection.name}`); //will show the name of the database
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit the process with failure
  }
};
