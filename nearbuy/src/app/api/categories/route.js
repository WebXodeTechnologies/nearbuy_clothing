import { withErrorHandler } from "@/middleware/error.middleware";
import { requireAdmin } from "@/middleware/admin.middleware";
import { validate } from "@/middleware/validate.middleware";
import { categorySchema } from "@/validations/category.schema";
import categoryService from "@/services/category.service";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const POST = withErrorHandler(async (req) => {
  await requireAdmin(req);
  await dbConnect();

  const body = await req.json();
  const validatedData = validate(categorySchema, body);

  const category = await categoryService.createCategory(validatedData);
  return ApiResponse.created(category, "Category created successfully");
});

export const GET = withErrorHandler(async (req) => {
  await dbConnect();

  const categories = await categoryService.getActiveCategories();
  return ApiResponse.success(categories, "Categories retrieved successfully");
});
