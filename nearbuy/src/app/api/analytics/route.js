import { withErrorHandler } from "@/middleware/error.middleware";
import analyticsService from "@/services/analytics.service";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const POST = withErrorHandler(async (req) => {
  await dbConnect();
  const body = await req.json();

  const event = await analyticsService.trackEvent(body);
  return ApiResponse.success(event, "Event logged successfully", 201);
});
