import vendorRepository from "@/repositories/vendor.repository";
import userRepository from "@/repositories/user.repository";
import slugify from "@/lib/slugify";
import ApiError from "@/utils/apiError";

class VendorService {
  async registerVendor(ownerId, vendorData) {
    const existingVendor = await vendorRepository.findByOwnerId(ownerId);
    if (existingVendor) {
      throw new ApiError(400, "Vendor application already exists for this account.");
    }

    const businessSlug = slugify(vendorData.businessName);
    const existingSlug = await vendorRepository.findBySlug(businessSlug);
    if (existingSlug) {
      throw new ApiError(400, "Business name already taken. Please choose another name.");
    }

    const vendor = await vendorRepository.create({
      ...vendorData,
      ownerId,
      businessSlug,
      status: "Pending",
    });

    // Automatically update User role to VENDOR and link vendorId
    await userRepository.updateProfile(ownerId, {
      role: "VENDOR",
      vendorId: vendor._id,
    });

    return vendor;
  }

  async getVendorByOwner(ownerId) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) {
      throw new ApiError(404, "Vendor record not found.");
    }
    return vendor;
  }

  async getVendorBySlug(slug) {
    const vendor = await vendorRepository.findBySlug(slug);
    if (!vendor) {
      throw new ApiError(404, "Vendor not found.");
    }
    return vendor;
  }

  async updateStatus(vendorId, status) {
    const validStatuses = ["Pending", "Approved", "Rejected", "Suspended"];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, "Invalid vendor status.");
    }

    const updatedVendor = await vendorRepository.updateStatus(vendorId, status);
    if (!updatedVendor) {
      throw new ApiError(404, "Vendor not found.");
    }
    return updatedVendor;
  }

  async updateVendorProfile(vendorId, updateData) {
    if (updateData.businessName) {
      updateData.businessSlug = slugify(updateData.businessName);
    }
    return await vendorRepository.updateProfile(vendorId, updateData);
  }

  async getAllVendors(query = {}, pagination = { limit: 10, skip: 0 }) {
    const vendors = await vendorRepository.findAll(query, pagination);
    const total = await vendorRepository.count(query);
    return { vendors, total };
  }
}

export default new VendorService();
