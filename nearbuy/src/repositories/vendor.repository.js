import Vendor from "@/models/Vendor";

class VendorRepository {
  async create(vendorData) {
    return await Vendor.create(vendorData);
  }

  async findById(id) {
    return await Vendor.findById(id).populate(
      "ownerId",
      "name email image role",
    );
  }

  async findByOwnerId(ownerId) {
    return await Vendor.findOne({ ownerId }).populate(
      "ownerId",
      "name email image role",
    );
  }

  async findBySlug(businessSlug) {
    return await Vendor.findOne({ businessSlug }).populate(
      "ownerId",
      "name email image role",
    );
  }

  async updateStatus(id, status) {
    return await Vendor.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );
  }

  /**
   * CRITICAL FIX: Ensure options include runValidators: true
   * and support updating directly by Vendor ID or Owner ID.
   */
  async updateProfile(id, updateData) {
    return await Vendor.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).populate("ownerId", "name email image role");
  }

  async updateProfileByOwnerId(ownerId, updateData) {
    return await Vendor.findOneAndUpdate(
      { ownerId },
      { $set: updateData },
      { new: true, runValidators: true },
    ).populate("ownerId", "name email image role");
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
