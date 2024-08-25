import mongoose from "mongoose";

const MAX_RETRIES = process.env.MONGODB_MAX_RETRIES
  ? parseInt(process.env.MONGODB_MAX_RETRIES)
  : 6;
const RETRY_DELAY_MS = process.env.MONGODB_RETRY_DELAY_MS
  ? parseInt(process.env.MONGODB_MAX_RETRIES)
  : 5000;

const connectWithRetry = async (retriesLeft) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(
      `Error connecting to MongoDB (${
        MAX_RETRIES - retriesLeft + 1
      }/${MAX_RETRIES}):`,
      error
    );
    if (retriesLeft > 0) {
      console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
      setTimeout(() => connectWithRetry(retriesLeft - 1), RETRY_DELAY_MS);
    } else {
      console.error("Max retries reached. Exiting...");
      process.exit(1);
    }
  }
};

export default async () => {
  connectWithRetry(MAX_RETRIES);
};
