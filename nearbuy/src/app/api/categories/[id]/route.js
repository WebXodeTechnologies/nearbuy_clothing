import { withErrorHandler } from "@/middleware/error.middleware";
import categoryController from "@/controllers/category.controller";

export const GET = withErrorHandler(async (req, context) => {
  return await categoryController.getCategoryById(req, context);
});

export const PUT = withErrorHandler(async (req, context) => {
  return await categoryController.updateCategory(req, context);
});

export const DELETE = withErrorHandler(async (req, context) => {
  return await categoryController.deleteCategory(req, context);
});
