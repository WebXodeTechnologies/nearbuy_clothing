import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

mongoose.set("strictQuery", true);

export default async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
      autoIndex: process.env.NODE_ENV === "development",
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then((mongooseInstance) => {
        console.log("✅ MongoDB Connected");
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }

  return cached.conn;
}
