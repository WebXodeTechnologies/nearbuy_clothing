const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

async function deleteUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    const result = await mongoose.connection.collection("users").deleteMany({
      email: "mail2meak22frcrio@gmail.com",
    });

    console.log(`Deleted ${result.deletedCount} user record(s) for mail2meak22frcrio@gmail.com.`);
    process.exit(0);
  } catch (err) {
    console.error("Error deleting user:", err);
    process.exit(1);
  }
}

deleteUser();
