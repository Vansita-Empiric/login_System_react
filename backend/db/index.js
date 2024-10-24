import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/login`);
    console.log(`\nMongoDB connected successfully`);
  } catch (error) {
    console.log("Error connecting database \n", error);
    process.exit(1);
  }
};

export default connectDB;
