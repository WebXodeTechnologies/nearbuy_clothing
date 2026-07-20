import categoryRepository from "@/repositories/category.repository";
import slugify from "@/lib/slugify";
import ApiError from "@/utils/apiError";

class CategoryService {
  async createCategory(categoryData) {
    const slug = slugify(categoryData.name);
    const existing = await categoryRepository.findBySlug(slug);

    if (existing) {
      throw new ApiError(400, "Category with this name already exists.");
    }

    return await categoryRepository.create({
      ...categoryData,
      slug,
    });
  }

  async getActiveCategories() {
    return await categoryRepository.findAllActive();
  }

  async getAllCategories() {
    return await categoryRepository.findAll();
  }

  async getCategoryBySlug(slug) {
    const category = await categoryRepository.findBySlug(slug);
    if (!category) {
      throw new ApiError(404, "Category not found.");
    }
    return category;
  }

  async updateCategory(id, updateData) {
    if (updateData.name) {
      updateData.slug = slugify(updateData.name);
    }
    return await categoryRepository.update(id, updateData);
  }

  async deleteCategory(id) {
    return await categoryRepository.delete(id);
  }
}

const categoryService = new CategoryService();
export default categoryService;

