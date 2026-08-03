import { authenticate } from "@/middleware/auth.middleware";
import { withErrorHandler } from "@/middleware/error.middleware";
import settingRepository from "@/repositories/settings.repository";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";

// GET /api/admin/settings -> Fetch system configuration
export const GET = withErrorHandler(async (req) => {
  const currentUser = await authenticate(req);
  if ((currentUser?.role || "").toUpperCase() !== "ADMIN") {
    throw new ApiError(403, "Access denied: Admin role required.");
  }

  const settings = await settingRepository.getSettings();
  return ApiResponse.success(
    settings,
    "Platform settings retrieved successfully",
  );
});

// PUT /api/admin/settings -> Update system configuration
export const PUT = withErrorHandler(async (req) => {
  const currentUser = await authenticate(req);
  if ((currentUser?.role || "").toUpperCase() !== "ADMIN") {
    throw new ApiError(403, "Access denied: Admin role required.");
  }

  const body = await req.json();
  const updatedSettings = await settingRepository.updateSettings(body);

  return ApiResponse.success(
    updatedSettings,
    "Platform settings saved successfully",
  );
});
