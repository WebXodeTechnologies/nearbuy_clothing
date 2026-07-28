import Store from "@/models/Store";

class StoreRepository {
  async create(storeData) {
    return await Store.create(storeData);
  }

  async findById(id) {
    return await Store.findById(id)
      .populate("vendorId", "businessName businessSlug logo coverImage phone email")
      .populate("categoryIds", "name slug image");
  }

  async findByVendorId(vendorId) {
    return await Store.find({ vendorId })
      .populate("vendorId", "businessName businessSlug logo coverImage phone email")
      .populate("categoryIds", "name slug image")
      .sort({ createdAt: -1 });
  }

  async findByCity(city, pagination = { limit: 10, skip: 0 }) {
    const filter = { isActive: true };
    if (city) {
      filter.city = { $regex: new RegExp(city, "i") };
    }

    return await Store.find(filter)
      .populate("vendorId", "businessName businessSlug logo coverImage")
      .populate("categoryIds", "name slug image")
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);
  }

  async findAll(query = {}, pagination = { limit: 10, skip: 0 }) {
    return await Store.find(query)
      .populate("vendorId", "businessName businessSlug logo coverImage")
      .populate("categoryIds", "name slug image")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);
  }

  async update(id, updateData) {
    return await Store.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Store.findByIdAndDelete(id);
  }

  async count(query = {}) {
    return await Store.countDocuments(query);
  }
}

export default new StoreRepository();
