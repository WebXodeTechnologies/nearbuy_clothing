import { withErrorHandler } from "@/middleware/error.middleware";
import { requireAdmin } from "@/middleware/admin.middleware";
import { validate } from "@/middleware/validate.middleware";
import { bannerSchema } from "@/validations/banner.schema";
import bannerService from "@/services/banner.service";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";

export const POST = withErrorHandler(async (req) => {
  await requireAdmin(req);
  await dbConnect();

  const body = await req.json();
  const validatedData = validate(bannerSchema, body);

  const banner = await bannerService.createBanner(validatedData);
  return ApiResponse.created(banner, "Banner created successfully");
});

export const GET = withErrorHandler(async (req) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";

  let banners;
  if (all) {
    banners = await bannerService.getAllBanners();
  } else {
    banners = await bannerService.getActiveBanners();
  }
  return ApiResponse.success(banners, "Banners retrieved successfully");
});
