import { createUploadthing } from "uploadthing/next";
import dbConnect from "@/lib/db";
import User from "@/models/User"; // 👈 Import User model
import Vendor from "@/models/Vendor"; // 👈 Import Vendor model

const f = createUploadthing();

export const ourFileRouter = {
  vendorAssetUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 10 },
  })
    .middleware(async ({ req }) => {
      try {
        await dbConnect();

        // 1. Get user email from header sent by frontend
        const userEmail = req.headers.get("x-user-email");
        console.log("UploadThing Middleware - Incoming User Email:", userEmail);

        if (!userEmail) {
          throw new Error("Unauthorized: Missing user email header.");
        }

        // 2. Find the User record first (to get their _id)
        const user = await User.findOne({ email: userEmail });
        if (!user) {
          throw new Error(`User account not found for email: ${userEmail}`);
        }

        // 3. Find the Vendor record using ownerId matching the User's _id
        let vendor = await Vendor.findOne({ ownerId: user._id });

        // Fallback: If not found by ownerId, try finding by vendorId from user doc if it exists
        if (!vendor && user.vendorId) {
          vendor = await Vendor.findById(user.vendorId);
        }

        if (!vendor) {
          throw new Error(`Vendor profile not found for user: ${userEmail}`);
        }

        // 4. Enforce 2GB Storage Limit Rule
        const currentUsage = vendor.storageUsedBytes || 0;
        const storageLimit = vendor.storageLimitBytes || 2 * 1024 * 1024 * 1024; // 2GB default

        if (currentUsage >= storageLimit) {
          throw new Error(
            "Storage limit of 2GB reached. Please upgrade your plan to upload more assets.",
          );
        }

        // Pass vendorId to onUploadComplete callback
        return { vendorId: vendor._id };
      } catch (err) {
        console.error("❌ UploadThing Middleware Error:", err.message);
        throw new Error(err.message || "Failed to run middleware");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        await dbConnect();

        // Increment vendor's total storage used in MongoDB
        await Vendor.findByIdAndUpdate(metadata.vendorId, {
          $inc: { storageUsedBytes: file.size },
        });

        console.log(
          `✅ Successfully tracked ${file.size} bytes for vendor: ${metadata.vendorId}`,
        );
      } catch (err) {
        console.error("❌ UploadComplete Database Error:", err.message);
      }
    }),
};
