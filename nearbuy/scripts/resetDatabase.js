import "dotenv/config";
import mongoose from "mongoose";

import dbConnect from "../src/lib/db.js";

import User from "../src/models/User.js";
import Vendor from "../src/models/Vendor.js";
import Store from "../src/models/Store.js";
import Collection from "../src/models/Collection.js";
import Offer from "../src/models/Offer.js";
import Subscription from "../src/models/Subscription.js";
import Banner from "../src/models/Banner.js";
import Contact from "../src/models/Contact.js";
import Analytics from "../src/models/Analytics.js";

async function resetDatabase() {
  try {
    console.log("\n🚀 Resetting Streetunics Database...\n");

    await dbConnect();

    console.log("✅ MongoDB Connected\n");

    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Store.deleteMany({}),
      Collection.deleteMany({}),
      Offer.deleteMany({}),
      Subscription.deleteMany({}),
      Banner.deleteMany({}),
      Contact.deleteMany({}),
      Analytics.deleteMany({}),
    ]);

    console.log("✅ Transactional data deleted successfully.\n");

    console.log("Master data preserved:");
    console.log("✔ Plans");
    console.log("✔ Categories");
    console.log("✔ CMS");

    console.log("\n🎉 Database reset completed successfully.");
  } catch (error) {
    console.error("\n❌ Failed to reset database.");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB Disconnected");
  }
}

resetDatabase();
