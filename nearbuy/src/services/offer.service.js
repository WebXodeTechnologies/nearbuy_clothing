import offerRepository from "@/repositories/offer.repository";
import vendorRepository from "@/repositories/vendor.repository";
import ApiError from "@/utils/apiError";

class OfferService {
  async createOffer(ownerId, offerData) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) {
      throw new ApiError(404, "Vendor profile required to create promotional offers.");
    }

    return await offerRepository.create({
      ...offerData,
      vendorId: vendor._id,
    });
  }

  async getOffersByVendor(vendorId) {
    return await offerRepository.findByVendorId(vendorId);
  }

  async getActiveOffers(pagination = { limit: 10, skip: 0 }) {
    const offers = await offerRepository.findActiveOffers(pagination);
    const total = await offerRepository.count({ status: "Active", endDate: { $gte: new Date() } });
    return { offers, total };
  }

  async getOfferById(id) {
    const offer = await offerRepository.findById(id);
    if (!offer) {
      throw new ApiError(404, "Offer listing not found.");
    }
    return offer;
  }

  async updateOffer(id, ownerId, updateData) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    const offer = await offerRepository.findById(id);

    if (!offer) {
      throw new ApiError(404, "Offer listing not found.");
    }

    if (offer.vendorId._id.toString() !== vendor._id.toString()) {
      throw new ApiError(403, "Unauthorized to modify this offer.");
    }

    return await offerRepository.update(id, updateData);
  }

  async deleteOffer(id, ownerId) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    const offer = await offerRepository.findById(id);

    if (!offer) {
      throw new ApiError(404, "Offer listing not found.");
    }

    if (offer.vendorId._id.toString() !== vendor._id.toString()) {
      throw new ApiError(403, "Unauthorized to delete this offer.");
    }

    return await offerRepository.delete(id);
  }
}

const offerService = new OfferService();
export default offerService;

