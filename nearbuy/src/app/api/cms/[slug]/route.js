import { withErrorHandler } from "@/middleware/error.middleware";
import cmsService from "@/services/cms.service";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const GET = withErrorHandler(async (req, { params }) => {
  await dbConnect();
  const { slug } = await params;

  const page = await cmsService.getPageBySlug(slug);
  return ApiResponse.success(page, "CMS page retrieved successfully");
});
