import Store from "@/models/Store";

class StoreRepository {
  async create(storeData) {
    return await Store.create(storeData);
  }

  async findById(id) {
    return await Store.findById(id).populate("vendorId", "businessName businessSlug logo coverImage phone email");
  }

  async findByVendorId(vendorId) {
    return await Store.find({ vendorId }).sort({ createdAt: -1 });
  }

  async findByCity(city, pagination = { limit: 10, skip: 0 }) {
    const filter = { status: "Active" };
    if (city) {
      filter.city = { $regex: new RegExp(city, "i") };
    }

    return await Store.find(filter)
      .populate("vendorId", "businessName businessSlug logo coverImage")
      .sort({ featured: -1, createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);
  }

  async findAll(query = {}, pagination = { limit: 10, skip: 0 }) {
    return await Store.find(query)
      .populate("vendorId", "businessName businessSlug logo coverImage")
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
