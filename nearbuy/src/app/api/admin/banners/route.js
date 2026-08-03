import { authenticate } from "@/middleware/auth.middleware";
import { withErrorHandler } from "@/middleware/error.middleware";
import ApiResponse from "@/utils/apiResponse";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

// Create a quick Banner schema inline or import your Banner model
const BannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    imageUrl: { type: String, required: true },
    linkUrl: { type: String, default: "/offers" },
    buttonText: { type: String, default: "Explore Now" },
    position: { type: String, default: "HERO" },
    sortOrder: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Banner = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);

// GET /api/admin/banners
export const GET = withErrorHandler(async (req) => {
  await authenticate(req);
  await dbConnect();

  const banners = await Banner.find().sort({ sortOrder: 1, createdAt: -1 });
  return ApiResponse.success(banners, "Banners retrieved successfully");
});

// POST /api/admin/banners
export const POST = withErrorHandler(async (req) => {
  await authenticate(req);
  await dbConnect();

  const body = await req.json();
  const newBanner = await Banner.create(body);

  return ApiResponse.created(newBanner, "Banner created successfully");
});
