import "dotenv/config";
import mongoose from "mongoose";
import dbConnect from "../src/lib/db.js";
import Plan from "../src/models/Plan.js";
import Category from "../src/models/Category.js";
import CMS from "../src/models/CMS.js";
import seedPlans from "./seedPlans.js";
import seedCategories from "./seedCategories.js";
import seedCMS from "./seedCMS.js";

async function seedDatabase() {
  try {
    console.log("\n🚀 Starting Nearbuy Database Seeder...\n");

    await dbConnect();

    console.log("✅ MongoDB Connected\n");

    // Clear only master data
    await Promise.all([
      Plan.deleteMany({}),
      Category.deleteMany({}),
      CMS.deleteMany({}),
    ]);

    console.log("🗑 Existing master data cleared\n");

    // Seed Master Collections
    await seedPlans();
    await seedCategories();
    await seedCMS();

    console.log("\n🎉 Database Seed Completed Successfully!\n");

    console.log("======================================");
    console.log("✔ Plans Seeded");
    console.log("✔ Categories Seeded");
    console.log("✔ CMS Pages Seeded");
    console.log("======================================");
  } catch (error) {
    console.error("\n❌ Seed Failed\n");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB Disconnected");
  }
}

seedDatabase();
