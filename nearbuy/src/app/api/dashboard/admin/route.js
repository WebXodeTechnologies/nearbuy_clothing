import { withErrorHandler } from "@/middleware/error.middleware";
import { requireAdmin } from "@/middleware/admin.middleware";
import dashboardService from "@/services/dashboard.service";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const GET = withErrorHandler(async (req) => {
  await requireAdmin(req);
  await dbConnect();

  const stats = await dashboardService.getAdminDashboardStats();
  return ApiResponse.success(stats, "Admin dashboard stats retrieved successfully");
});
