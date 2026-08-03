import { authenticate } from "@/middleware/auth.middleware";
import { withErrorHandler } from "@/middleware/error.middleware";
import CMS from "@/models/CMS";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";

// PUT /api/admin/cms/[id] -> Update an existing CMS document
export const PUT = withErrorHandler(async (req, { params }) => {
  const currentUser = await authenticate(req);
  if ((currentUser?.role || "").toUpperCase() !== "ADMIN") {
    throw new ApiError(
      403,
      "Access denied: Platform Administrator role required.",
    );
  }

  // Next.js 15 requires awaiting dynamic route params
  const { id } = await params;
  await dbConnect();

  const body = await req.json();

  // If title is changing and slug is not explicitly provided, update slug automatically
  if (body.title && !body.slug) {
    body.slug = body.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Track publication timestamps if state changes
  if (body.isPublished === true) {
    const existingDoc = await CMS.findById(id);
    if (existingDoc && !existingDoc.isPublished) {
      body.publishedAt = new Date();
    }
  }

  const updatedCms = await CMS.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true, runValidators: true },
  );

  if (!updatedCms) {
    throw new ApiError(404, "CMS document not found.");
  }

  return ApiResponse.success(updatedCms, "CMS entry updated successfully");
});

// DELETE /api/admin/cms/[id] -> Permanently remove a CMS document
export const DELETE = withErrorHandler(async (req, { params }) => {
  const currentUser = await authenticate(req);
  if ((currentUser?.role || "").toUpperCase() !== "ADMIN") {
    throw new ApiError(
      403,
      "Access denied: Platform Administrator role required.",
    );
  }

  const { id } = await params;
  await dbConnect();

  const deletedCms = await CMS.findByIdAndDelete(id);

  if (!deletedCms) {
    throw new ApiError(404, "CMS document not found.");
  }

  return ApiResponse.success(null, "CMS entry deleted successfully");
});
