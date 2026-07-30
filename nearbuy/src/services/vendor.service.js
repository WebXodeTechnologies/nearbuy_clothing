// services/vendor.service.js
import vendorRepository from "@/repositories/vendor.repository";
import ApiError from "@/utils/apiError";

class VendorService {
  async updateVendorProfile(vendorIdOrOwnerId, updateData) {
    // Try updating by Vendor document ID first
    let vendor = await vendorRepository.updateProfile(
      vendorIdOrOwnerId,
      updateData,
    );

    // Fallback: If passed ID was the User/Owner ID instead of Vendor ID
    if (!vendor) {
      vendor = await vendorRepository.updateProfileByOwnerId(
        vendorIdOrOwnerId,
        updateData,
      );
    }

    if (!vendor) {
      throw new ApiError(404, "Vendor profile not found to update.");
    }

    return vendor;
  }

  async getAllVendors(query, pagination) {
    const vendors = await vendorRepository.findAll(query, pagination);
    const total = await vendorRepository.count(query);
    return { vendors, total };
  }

  async updateStatus(vendorId, status) {
    const vendor = await vendorRepository.updateStatus(vendorId, status);
    if (!vendor) throw new ApiError(404, "Vendor not found.");
    return vendor;
  }
}

const vendorService = new VendorService();
export default vendorService;
