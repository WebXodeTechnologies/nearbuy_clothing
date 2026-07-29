import collectionRepository from "@/repositories/collection.repository";
import vendorRepository from "@/repositories/vendor.repository";
import storeRepository from "@/repositories/store.repository";
import userRepository from "@/repositories/user.repository";
import ApiError from "@/utils/apiError";

class CollectionService {
  async createCollection(ownerId, collectionData) {
    // 1. Resolve Vendor
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

    // 2. Resolve or Auto-Provision Store ID (fixes required storeId error)
    let storeId = collectionData.storeId;
    if (!storeId) {
      const stores = await storeRepository.findByVendorId(vendor._id);
      if (stores && stores.length > 0) {
        storeId = stores[0]._id;
      } else {
        // Create base store record if vendor has no store yet
        const defaultStore = await storeRepository.create({
          vendorId: vendor._id,
          storeName: vendor.businessName,
          address: "Salem Main Road",
          city: "Namakkal",
          pincode: "637001",
          phone: vendor.phone || "+91 98765 43210",
          whatsapp: vendor.whatsappNumber || "+91 98765 43210",
        });
        storeId = defaultStore._id;
      }
    }

    // 3. Normalize single categoryId into categoryIds array if provided
    let categoryIds = collectionData.categoryIds || [];
    if (collectionData.categoryId) {
      categoryIds = [collectionData.categoryId];
    }

    // 4. Set coverImage from images array if not explicitly set
    const images = collectionData.images || [];
    const coverImage = collectionData.coverImage || images[0] || "";

    const payload = {
      ...collectionData,
      vendorId: vendor._id,
      storeId,
      categoryIds,
      images,
      coverImage,
    };

    return await collectionRepository.create(payload);
  }

  async getCollectionsByVendor(vendorId, pagination = { limit: 10, skip: 0 }) {
    const collections = await collectionRepository.findByVendorId(
      vendorId,
      pagination,
    );
    const total = await collectionRepository.count({ vendorId });
    return { collections, total };
  }

  async getCollectionsByCategory(
    categoryId,
    pagination = { limit: 10, skip: 0 },
  ) {
    const collections = await collectionRepository.findByCategory(
      categoryId,
      pagination,
    );
    const total = await collectionRepository.count({
      categoryIds: categoryId,
      isActive: true,
    });
    return { collections, total };
  }

  async getCollectionById(id) {
    const collection = await collectionRepository.findById(id);
    if (!collection) {
      throw new ApiError(404, "Collection lookbook not found.");
    }
    return collection;
  }

  async updateCollection(id, ownerId, updateData) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) {
      throw new ApiError(404, "Vendor profile not found.");
    }

    const collection = await collectionRepository.findById(id);
    if (!collection) {
      throw new ApiError(404, "Collection lookbook not found.");
    }

    // Safe comparison whether vendorId is populated object or raw ObjectId
    const collectionVendorId = (
      collection.vendorId?._id || collection.vendorId
    ).toString();
    if (collectionVendorId !== vendor._id.toString()) {
      throw new ApiError(403, "Unauthorized to modify this collection.");
    }

    // Normalize categoryId if passed
    if (updateData.categoryId) {
      updateData.categoryIds = [updateData.categoryId];
    }

    // Sync cover image if images array updated
    if (
      updateData.images &&
      updateData.images.length > 0 &&
      !updateData.coverImage
    ) {
      updateData.coverImage = updateData.images[0];
    }

    return await collectionRepository.update(id, updateData);
  }

  async deleteCollection(id, ownerId) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) {
      throw new ApiError(404, "Vendor profile not found.");
    }

    const collection = await collectionRepository.findById(id);
    if (!collection) {
      throw new ApiError(404, "Collection lookbook not found.");
    }

    const collectionVendorId = (
      collection.vendorId?._id || collection.vendorId
    ).toString();
    if (collectionVendorId !== vendor._id.toString()) {
      throw new ApiError(403, "Unauthorized to delete this collection.");
    }

    return await collectionRepository.delete(id);
  }
}

const collectionService = new CollectionService();
export default collectionService;
