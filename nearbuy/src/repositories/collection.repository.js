import Collection from "@/models/Collection";

class CollectionRepository {
  async create(collectionData) {
    return await Collection.create(collectionData);
  }

  async findById(id) {
    return await Collection.findById(id)
      .populate("vendorId", "businessName businessSlug logo")
      .populate("categoryIds", "name slug");
  }

  async findByVendorId(vendorId, pagination = { limit: 10, skip: 0 }) {
    return await Collection.find({ vendorId })
      .populate("categoryIds", "name slug")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);
  }

  async findByCategory(categoryId, pagination = { limit: 10, skip: 0 }) {
    return await Collection.find({ categoryIds: categoryId, isActive: true })
      .populate("vendorId", "businessName businessSlug logo")
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);
  }

  async findAll(query = {}, pagination = { limit: 10, skip: 0 }) {
    return await Collection.find(query)
      .populate("vendorId", "businessName businessSlug logo")
      .populate("categoryIds", "name slug")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);
  }

  async update(id, updateData) {
    return await Collection.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Collection.findByIdAndDelete(id);
  }

  async count(query = {}) {
    return await Collection.countDocuments(query);
  }
}

export default new CollectionRepository();
