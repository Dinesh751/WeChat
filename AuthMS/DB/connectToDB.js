import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

export default connectToDB;