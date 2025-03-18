import mongoose from "mongoose";

const connect = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("Already connected to MongoDB.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo Connection successfully established.");
  } catch (error) {
    console.error("Error connecting to Mongoose:", error);
    throw new Error("Error connecting to Mongoose");
  }
};

export default connect;
