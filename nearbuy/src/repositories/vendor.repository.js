import Vendor from "@/models/Vendor";

class VendorRepository {
  async create(vendorData) {
    return await Vendor.create(vendorData);
  }

  async findById(id) {
    return await Vendor.findById(id).populate("ownerId", "name email image role");
  }

  async findByOwnerId(ownerId) {
    return await Vendor.findOne({ ownerId }).populate("ownerId", "name email image role");
  }

  async findBySlug(businessSlug) {
    return await Vendor.findOne({ businessSlug }).populate("ownerId", "name email image role");
  }

  async updateStatus(id, status) {
    return await Vendor.findByIdAndUpdate(id, { status }, { new: true });
  }

  async updateProfile(id, updateData) {
    return await Vendor.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findAll(query = {}, pagination = { limit: 10, skip: 0 }) {
    return await Vendor.find(query)
      .populate("ownerId", "name email image role")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);
  }

  async count(query = {}) {
    return await Vendor.countDocuments(query);
  }
}

export default new VendorRepository();
