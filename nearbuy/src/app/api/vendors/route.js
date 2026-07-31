import { requireAdmin } from "@/middleware/auth.middleware";
import dbConnect from "@/lib/db";
import vendorService from "@/services/vendor.service";
import ApiResponse from "@/utils/apiResponse";
import { withErrorHandler } from "@/middleware/error.middleware";

export const GET = withErrorHandler(async (req) => {
  await requireAdmin(req);
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const status = searchParams.get("status");

  const query = {};
  if (status) query.status = status;

  const result = await vendorService.getAllVendors(query, {
    limit,
    skip: (page - 1) * limit,
  });

  return ApiResponse.success(
    { ...result, page, limit },
    "Vendors list retrieved successfully",
  );
});
