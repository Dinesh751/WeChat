import mongoose from "mongoose";


// Mongoose connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("reconnected", () => {
  console.log("Mongoose reconnected to MongoDB");
});

mongoose.connection.on("close", () => {
  console.log("Mongoose connection closed");
});

// Connect to MongoDB
const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      autoIndex: process.env.NODE_ENV !== "production", // Disable autoIndex in production
    });
    
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

// Graceful shutdown
const handleShutdown = async () => {
  try {
    await mongoose.connection.close();
    console.log("Mongoose connection closed gracefully");
    process.exit(0);
  } catch (err) {
    console.error("Error during Mongoose shutdown:", err.message);
    process.exit(1);
  }
};

// Listen for termination signals
process.on("SIGINT", handleShutdown); // ctrl+c signal interrupt
process.on("SIGTERM", handleShutdown); // kill or Docker stop signal kill<pid> or docker stop

export default connectToDb;