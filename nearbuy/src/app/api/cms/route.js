import { withErrorHandler } from "@/middleware/error.middleware";
import { requireAdmin } from "@/middleware/admin.middleware";
import { validate } from "@/middleware/validate.middleware";
import { cmsSchema } from "@/validations/cms.schema";
import cmsService from "@/services/cms.service";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const POST = withErrorHandler(async (req) => {
  await requireAdmin(req);
  await dbConnect();

  const body = await req.json();
  const validatedData = validate(cmsSchema, body);

  const page = await cmsService.createPage(validatedData);
  return ApiResponse.created(page, "CMS page created successfully");
});

export const GET = withErrorHandler(async () => {
  await dbConnect();

  const pages = await cmsService.getAllPages();
  return ApiResponse.success(pages, "CMS pages retrieved successfully");
});
