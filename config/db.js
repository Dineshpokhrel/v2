import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}\n`);
    return connectionInstance;
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};

const createMongoStore = async () => {
  await connectDB();

  const mongoStoreOptions = {
    mongoUrl: `${process.env.MONGODB_URI}/${DB_NAME}`, 
    ttl: 24 * 60 * 60, // Time to live (in seconds), set to 1 day
  };

  return MongoStore.create(mongoStoreOptions);
};

export { connectDB, createMongoStore };


