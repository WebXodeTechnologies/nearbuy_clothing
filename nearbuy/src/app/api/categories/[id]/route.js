import { withErrorHandler } from "@/middleware/error.middleware";
import { requireAdmin } from "@/middleware/admin.middleware";
import { validate } from "@/middleware/validate.middleware";
import { updateCategorySchema } from "@/validations/category.schema";
import categoryService from "@/services/category.service";
import categoryRepository from "@/repositories/category.repository";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const GET = withErrorHandler(async (req, { params }) => {
  await dbConnect();
  const { id } = await params;

  const category = await categoryRepository.findById(id);
  return ApiResponse.success(category, "Category retrieved successfully");
});

export const PUT = withErrorHandler(async (req, { params }) => {
  await requireAdmin(req);
  await dbConnect();
  const { id } = await params;

  const body = await req.json();
  const validatedData = validate(updateCategorySchema, body);

  const category = await categoryService.updateCategory(id, validatedData);
  return ApiResponse.success(category, "Category updated successfully");
});

export const DELETE = withErrorHandler(async (req, { params }) => {
  await requireAdmin(req);
  await dbConnect();
  const { id } = await params;

  await categoryService.deleteCategory(id);
  return ApiResponse.success(null, "Category deleted successfully");
});
