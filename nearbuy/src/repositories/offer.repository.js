import Offer from "@/models/Offer";
import "@/models/Vendor";
import "@/models/Store";

class OfferRepository {
  async create(offerData) {
    return await Offer.create(offerData);
  }

  async findById(id) {
    return await Offer.findById(id)
      .populate("vendorId", "businessName businessSlug logo phone whatsapp")
      .populate("storeId", "storeName storeSlug city area")
      .lean();
  }

  async findByVendorId(vendorId, pagination = { limit: 10, skip: 0 }) {
    return await Offer.find({ vendorId })
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean();
  }

  async findActiveOffers(pagination = { limit: 10, skip: 0 }) {
    const now = new Date();
    return await Offer.find({
      status: "Active",
      endDate: { $gte: now },
    })
      .populate("vendorId", "businessName businessSlug logo coverImage")
      .populate("storeId", "storeName storeSlug city area")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean();
  }

  async findAll(query = {}, pagination = { limit: 10, skip: 0 }) {
    return await Offer.find(query)
      .populate("vendorId", "businessName businessSlug logo")
      .populate("storeId", "storeName storeSlug city area")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean();
  }

  async update(id, updateData) {
    return await Offer.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );
  }

  async delete(id) {
    return await Offer.findByIdAndDelete(id);
  }

  async count(query = {}) {
    return await Offer.countDocuments(query);
  }
}

const offerRepository = new OfferRepository();
export default offerRepository;
