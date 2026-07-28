import { requireAdmin } from "@/middleware/admin.middleware";
import { validate } from "@/middleware/validate.middleware";
import { categorySchema, updateCategorySchema } from "@/validations/category.schema";
import categoryService from "@/services/category.service";
import categoryRepository from "@/repositories/category.repository";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";

class CategoryController {
  async createCategory(req) {
    await requireAdmin(req);
    await dbConnect();

    const body = await req.json();
    const validatedData = validate(categorySchema, body);

    const category = await categoryService.createCategory(validatedData);
    return ApiResponse.created(category, "Category created successfully");
  }

  async getCategories(req) {
    await dbConnect();

    const categories = await categoryService.getActiveCategories();
    return ApiResponse.success(categories, "Categories retrieved successfully");
  }

  async getCategoryById(req, { params }) {
    await dbConnect();
    const { id } = await params;

    const category = await categoryRepository.findById(id);
    return ApiResponse.success(category, "Category retrieved successfully");
  }

  async updateCategory(req, { params }) {
    await requireAdmin(req);
    await dbConnect();
    const { id } = await params;

    const body = await req.json();
    const validatedData = validate(updateCategorySchema, body);

    const category = await categoryService.updateCategory(id, validatedData);
    return ApiResponse.success(category, "Category updated successfully");
  }

  async deleteCategory(req, { params }) {
    await requireAdmin(req);
    await dbConnect();
    const { id } = await params;

    await categoryService.deleteCategory(id);
    return ApiResponse.success(null, "Category deleted successfully");
  }
}

const categoryController = new CategoryController();
export default categoryController;
