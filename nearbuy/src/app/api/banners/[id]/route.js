import { withErrorHandler } from "@/middleware/error.middleware";
import { requireAdmin } from "@/middleware/admin.middleware";
import { validate } from "@/middleware/validate.middleware";
import { updateBannerSchema } from "@/validations/banner.schema";
import bannerService from "@/services/banner.service";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";

export const PUT = withErrorHandler(async (req, { params }) => {
  await requireAdmin(req);
  await dbConnect();
  const { id } = await params;

  const body = await req.json();
  const validatedData = validate(updateBannerSchema, body);

  const updatedBanner = await bannerService.updateBanner(id, validatedData);
  return ApiResponse.success(updatedBanner, "Banner updated successfully");
});

export const DELETE = withErrorHandler(async (req, { params }) => {
  await requireAdmin(req);
  await dbConnect();
  const { id } = await params;

  await bannerService.deleteBanner(id);
  return ApiResponse.success(null, "Banner deleted successfully");
});
