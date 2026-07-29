import galleryRepository from "@/repositories/gallery.repository";
import vendorRepository from "@/repositories/vendor.repository";
import userRepository from "@/repositories/user.repository";
import ApiError from "@/utils/apiError";

class GalleryService {
  async createAsset(ownerId, assetData) {
    let vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) {
      const user = await userRepository.findById(ownerId);
      if (!user) throw new ApiError(404, "User profile not found");

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

    return await galleryRepository.create({
      ...assetData,
      vendorId: vendor._id,
    });
  }

  async getAssetsByVendor(vendorId) {
    return await galleryRepository.findByVendorId(vendorId);
  }

  async deleteAsset(id, ownerId) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) throw new ApiError(404, "Vendor profile not found");

    const asset = await galleryRepository.findById(id);
    if (!asset) throw new ApiError(404, "Asset not found");

    const assetVendorId = (asset.vendorId?._id || asset.vendorId).toString();
    if (assetVendorId !== vendor._id.toString()) {
      throw new ApiError(403, "Unauthorized to delete this asset");
    }

    return await galleryRepository.delete(id);
  }
}

const galleryService = new GalleryService();
export default galleryService;
