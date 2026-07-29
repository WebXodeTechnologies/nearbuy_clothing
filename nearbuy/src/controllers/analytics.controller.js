import { validate } from "@/middleware/validate.middleware";
import { trackEventSchema } from "@/validations/analytics.schema";
import analyticsService from "@/services/analytics.service";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";

class AnalyticsController {
  /**
   * Track public visitor clicks (WhatsApp, Phone, Store Views)
   */
  async trackEvent(req) {
    await dbConnect();
    const body = await req.json();

    // Normalize eventType to uppercase before validation
    if (body?.eventType) {
      body.eventType = body.eventType.toUpperCase();
    }

    const validatedData = validate(trackEventSchema, body);
    const event = await analyticsService.trackEvent(validatedData);

    return ApiResponse.created(event, "Analytics event tracked successfully");
  }

  /**
   * Get Analytics Metrics for Vendor Dashboard
   */
  async getVendorMetrics(req) {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const vendorId = searchParams.get("vendor");
    const range = searchParams.get("range") || "30days";

    if (!vendorId) {
      return ApiResponse.badRequest("Vendor ID parameter is required");
    }

    const metrics = await analyticsService.getVendorMetrics(vendorId, range);
    return ApiResponse.success(
      metrics,
      "Vendor metrics retrieved successfully",
    );
  }

  /**
   * Get Overall Platform Analytics (for Admin Dashboard)
   */
  async getPlatformMetrics(req) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30days";

    const metrics = await analyticsService.getPlatformMetrics(range);
    return ApiResponse.success(
      metrics,
      "Platform analytics retrieved successfully",
    );
  }
}

const analyticsController = new AnalyticsController();
export default analyticsController;
