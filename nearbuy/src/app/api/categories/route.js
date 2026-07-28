import { withErrorHandler } from "@/middleware/error.middleware";
import categoryController from "@/controllers/category.controller";

export const POST = withErrorHandler(async (req) => {
  return await categoryController.createCategory(req);
});

export const GET = withErrorHandler(async (req) => {
  return await categoryController.getCategories(req);
});
