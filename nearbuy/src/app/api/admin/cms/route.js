import { authenticate } from "@/middleware/auth.middleware";
import { withErrorHandler } from "@/middleware/error.middleware";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

// Inline Cms Model or import your Cms model
const CmsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["pages", "faqs", "announcements"],
      default: "pages",
    },
    title: { type: String, required: true },
    question: { type: String },
    slug: { type: String },
    category: { type: String, default: "General" },
    content: { type: String, required: true },
    answer: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Cms = mongoose.models.Cms || mongoose.model("Cms", CmsSchema);

// GET /api/admin/cms -> Retrieve static pages & FAQs
export const GET = withErrorHandler(async (req) => {
  await authenticate(req);
  await dbConnect();

  const [pages, faqs] = await Promise.all([
    Cms.find({ type: "pages" }).sort({ updatedAt: -1 }),
    Cms.find({ type: "faqs" }).sort({ updatedAt: -1 }),
  ]);

  return ApiResponse.success(
    { pages, faqs },
    "CMS data retrieved successfully",
  );
});

// POST /api/admin/cms -> Create a new page or FAQ
export const POST = withErrorHandler(async (req) => {
  await authenticate(req);
  await dbConnect();

  const body = await req.json();
  const newCms = await Cms.create(body);

  return ApiResponse.created(newCms, "CMS entry created successfully");
});
