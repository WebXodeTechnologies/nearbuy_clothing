import Category from "@/models/Category";

class CategoryRepository {
  async create(categoryData) {
    return await Category.create(categoryData);
  }

  async findById(id) {
    return await Category.findById(id);
  }

  async findBySlug(slug) {
    return await Category.findOne({ slug });
  }

  async findAllActive() {
    return await Category.find({ isActive: true }).sort({ name: 1 });
  }

  async findAll(query = {}) {
    return await Category.find(query).sort({ createdAt: -1 });
  }

  async update(id, updateData) {
    return await Category.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Category.findByIdAndDelete(id);
  }
}

export default new CategoryRepository();
