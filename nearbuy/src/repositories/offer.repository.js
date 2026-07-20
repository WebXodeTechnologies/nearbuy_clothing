import Offer from "@/models/Offer";

class OfferRepository {
  async create(offerData) {
    return await Offer.create(offerData);
  }

  async findById(id) {
    return await Offer.findById(id).populate("vendorId", "businessName businessSlug logo");
  }

  async findByVendorId(vendorId) {
    return await Offer.find({ vendorId }).sort({ createdAt: -1 });
  }

  async findActiveOffers(pagination = { limit: 10, skip: 0 }) {
    const now = new Date();
    return await Offer.find({
      status: "Active",
      endDate: { $gte: now },
    })
      .populate("vendorId", "businessName businessSlug logo coverImage")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);
  }

  async update(id, updateData) {
    return await Offer.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Offer.findByIdAndDelete(id);
  }

  async count(query = {}) {
    return await Offer.countDocuments(query);
  }
}

export default new OfferRepository();
