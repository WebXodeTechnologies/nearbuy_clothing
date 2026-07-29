import { withErrorHandler } from "@/middleware/error.middleware";
import analyticsService from "@/services/analytics.service";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";

export const GET = withErrorHandler(async (req) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);

  const vendorId = searchParams.get("vendor");
  const range = searchParams.get("range") || "30days";

  if (!vendorId) {
    return ApiResponse.error("Vendor ID is required", 400);
  }

  const metrics = await analyticsService.getVendorMetrics(vendorId, range);
  return ApiResponse.success(
    metrics,
    "Vendor analytics retrieved successfully",
  );
});
