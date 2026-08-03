import { authenticate } from "@/middleware/auth.middleware";
import { withErrorHandler } from "@/middleware/error.middleware";
import platformSettingRepository from "@/repositories/platformSetting.repository";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";

export const GET = withErrorHandler(async (req) => {
  const currentUser = await authenticate(req);
  if ((currentUser?.role || "").toUpperCase() !== "ADMIN") {
    throw new ApiError(
      403,
      "Access denied: Platform Administrator role required.",
    );
  }

  const settings = await platformSettingRepository.getSettings();
  return ApiResponse.success(
    settings,
    "Platform settings retrieved successfully",
  );
});

export const PUT = withErrorHandler(async (req) => {
  const currentUser = await authenticate(req);
  if ((currentUser?.role || "").toUpperCase() !== "ADMIN") {
    throw new ApiError(
      403,
      "Access denied: Platform Administrator role required.",
    );
  }

  const body = await req.json();
  const updatedSettings = await platformSettingRepository.updateSettings(body);

  return ApiResponse.success(
    updatedSettings,
    "Platform settings updated successfully",
  );
});
