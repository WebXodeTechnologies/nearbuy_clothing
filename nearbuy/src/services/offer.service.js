import offerRepository from "@/repositories/offer.repository";
import vendorRepository from "@/repositories/vendor.repository";
import storeRepository from "@/repositories/store.repository";
import userRepository from "@/repositories/user.repository";
import ApiError from "@/utils/apiError";

class OfferService {
  async createOffer(ownerId, offerData) {
    // 1. Resolve Vendor Profile
    let vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) {
      const user = await userRepository.findById(ownerId);
      if (!user) throw new ApiError(404, "User account profile not found.");

      const businessName = user.name || "My Boutique";
      const businessSlug =
        businessName
          .toLowerCase()
          .trim()
          .replace(/[\s_-]+/g, "-") +
        "-" +
        Math.floor(Math.random() * 10000);

      vendor = await vendorRepository.create({
        ownerId: user._id,
        businessName,
        businessSlug,
        status: "Approved",
      });
    }

    // 2. Resolve Store ID (auto-assign vendor's primary store)
    let storeId = offerData.storeId;
    if (!storeId) {
      const stores = await storeRepository.findByVendorId(vendor._id);
      if (stores && stores.length > 0) {
        storeId = stores[0]._id;
      }
    }

    // 3. Fallback Coupon Code Generation
    const couponCode =
      offerData.couponCode ||
      (offerData.title || "OFFER")
        .substring(0, 5)
        .replace(/\s+/g, "")
        .toUpperCase() + (offerData.discountValue || "20");

    const payload = {
      ...offerData,
      couponCode,
      vendorId: vendor._id,
      storeId,
    };

    return await offerRepository.create(payload);
  }

  async getOffersByVendor(vendorId, pagination = { limit: 10, skip: 0 }) {
    const offers = await offerRepository.findByVendorId(vendorId, pagination);
    const total = await offerRepository.count({ vendorId });
    return { offers, total };
  }

  async getActiveOffers(pagination = { limit: 10, skip: 0 }) {
    const offers = await offerRepository.findActiveOffers(pagination);
    const total = await offerRepository.count({
      status: "Active",
      endDate: { $gte: new Date() },
    });
    return { offers, total };
  }

  async getOfferById(id) {
    const offer = await offerRepository.findById(id);
    if (!offer) {
      throw new ApiError(404, "Promotional offer not found.");
    }
    return offer;
  }

  async updateOffer(id, ownerId, updateData) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) throw new ApiError(404, "Vendor profile not found.");

    const offer = await offerRepository.findById(id);
    if (!offer) throw new ApiError(404, "Promotional offer not found.");

    // Safe vendor ownership verification
    const offerVendorId = (offer.vendorId?._id || offer.vendorId).toString();
    if (offerVendorId !== vendor._id.toString()) {
      throw new ApiError(403, "Unauthorized to modify this offer campaign.");
    }

    return await offerRepository.update(id, updateData);
  }

  async deleteOffer(id, ownerId) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) throw new ApiError(404, "Vendor profile not found.");

    const offer = await offerRepository.findById(id);
    if (!offer) throw new ApiError(404, "Promotional offer not found.");

    // Safe vendor ownership verification
    const offerVendorId = (offer.vendorId?._id || offer.vendorId).toString();
    if (offerVendorId !== vendor._id.toString()) {
      throw new ApiError(403, "Unauthorized to delete this offer campaign.");
    }

    return await offerRepository.delete(id);
  }

  async getAllOffers(query = {}, pagination = { limit: 10, skip: 0 }) {
    const offers = await offerRepository.findAll(query, pagination);
    const total = await offerRepository.count(query);
    return { offers, total };
  }
}

const offerService = new OfferService();
export default offerService;
