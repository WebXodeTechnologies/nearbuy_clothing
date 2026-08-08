import { authenticate } from "@/middleware/auth.middleware";
import dbConnect from "@/lib/db";
import Store from "@/models/Store";
import Vendor from "@/models/Vendor";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";
import { withErrorHandler } from "@/middleware/error.middleware";

// GET -> Fetch all stores for the admin panel
export const GET = withErrorHandler(async (req) => {
  const user = await authenticate(req);
  const role = (user?.role || "").toUpperCase();

  if (!user || role !== "ADMIN") {
    throw new ApiError(403, "Access denied: Admin privileges required.");
  }

  await dbConnect();

  const stores = await Store.find({})
    .populate("vendorId")
    .sort({ createdAt: -1 });

  return ApiResponse.success(
    { stores: stores || [] },
    "All stores retrieved successfully",
  );
});
