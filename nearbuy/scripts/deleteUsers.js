import "dotenv/config";
import mongoose from "mongoose";

import dbConnect from "../src/lib/db.js";
import User from "../src/models/User.js";

async function deleteUser() {
  try {
    const email = process.argv[2];

    if (!email) {
      console.log("\n❌ Please provide an email address.");
      console.log("\nExample:");
      console.log("npm run delete-user admin@streetunics.com\n");
      process.exit(1);
    }

    await dbConnect();

    console.log("✅ MongoDB Connected\n");

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      console.log(`⚠️ User not found: ${email}`);
      return;
    }

    await User.deleteOne({
      _id: user._id,
    });

    console.log(`✅ User deleted successfully.`);
    console.log(`Email: ${email}`);
  } catch (error) {
    console.error("\n❌ Failed to delete user.");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB Disconnected");
  }
}

deleteUser();
