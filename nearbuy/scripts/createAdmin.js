import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import dbConnect from "../src/lib/db.js";
import User from "../src/models/User.js";

async function createAdmin() {
  try {
    await dbConnect();

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@streetunics.com";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123456";

    let admin = await User.findOne({
      email: ADMIN_EMAIL.toLowerCase(),
    });

    if (admin) {
      admin.role = "ADMIN";
      admin.isActive = true;
      admin.isVerified = true;

      await admin.save();

      console.log("✅ Existing user promoted to ADMIN");
      console.log(`Email : ${admin.email}`);
    } else {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

      admin = await User.create({
        name: "Super Admin",
        email: ADMIN_EMAIL.toLowerCase(),
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
        isVerified: true,
      });

      console.log("✅ Admin account created successfully");
      console.log(`Email : ${admin.email}`);
      console.log(`Password : ${ADMIN_PASSWORD}`);
    }
  } catch (error) {
    console.error("❌ Failed to create admin");
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
}

createAdmin();
