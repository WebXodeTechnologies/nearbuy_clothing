import storeRepository from "@/repositories/store.repository";
import vendorRepository from "@/repositories/vendor.repository";
import userRepository from "@/repositories/user.repository";
import ApiError from "@/utils/apiError";

class StoreService {
  async createStore(ownerId, storeData) {
    // 1. Fetch User Record
    const user = await userRepository.findById(ownerId);
    if (!user) {
      throw new ApiError(404, "User account profile not found.");
    }

    // 2. Verify or Auto-Provision Vendor Profile
    let vendor = await vendorRepository.findByOwnerId(ownerId);

    if (!vendor) {
      const businessName = storeData.storeName || user.name || "My Boutique";
      const businessSlug =
        businessName
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-") +
        "-" +
        Math.floor(Math.random() * 10000);

      vendor = await vendorRepository.create({
        ownerId: user._id,
        businessName,
        businessSlug,
        email: user.email || storeData.email || "",
        phone: storeData.phone || user.phone || "",
        whatsappNumber: storeData.whatsapp || "",
        logo: storeData.logo || "",
        coverImage: storeData.coverImage || "",
        status: "Approved",
        isVerified: true,
        profileCompleted: true,
      });
    }

    // 3. Enforce Approval Guard
    if (vendor.status !== "Approved" && vendor.status !== "Pending") {
      throw new ApiError(
        403,
        "Your vendor account application is currently under review or suspended.",
      );
    }

    // 4. Sync Store Branding back to Vendor Profile safely
    if (storeData.logo !== undefined || storeData.coverImage !== undefined) {
      const vendorUpdates = {};
      if (storeData.logo !== undefined) vendorUpdates.logo = storeData.logo;
      if (storeData.coverImage !== undefined)
        vendorUpdates.coverImage = storeData.coverImage;
      if (user.email) vendorUpdates.email = user.email;

      await vendorRepository.updateProfile(vendor._id, vendorUpdates);
    }

    // 5. Auto-generate Store Slug if missing
    if (storeData.storeName && !storeData.storeSlug) {
      storeData.storeSlug =
        storeData.storeName
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "") +
        "-" +
        Math.floor(Math.random() * 10000);
    }

    // 6. Create Store Record
    const store = await storeRepository.create({
      ...storeData,
      vendorId: vendor._id,
    });

    // 7. Link Store ID back to Vendor Profile
    if (!vendor.storeId) {
      await vendorRepository.updateProfile(vendor._id, { storeId: store._id });
    }

    return store;
  }

  async updateStore(storeId, ownerId, updateData) {
    const user = await userRepository.findById(ownerId);
    let vendor = await vendorRepository.findByOwnerId(ownerId);

    if (!vendor) {
      const businessName = updateData.storeName || "My Boutique";
      const businessSlug =
        businessName
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-") +
        "-" +
        Math.floor(Math.random() * 10000);

      vendor = await vendorRepository.create({
        ownerId,
        businessName,
        businessSlug,
        email: user?.email || updateData.email || "",
        phone: updateData.phone || user?.phone || "",
        status: "Approved",
        isVerified: true,
        profileCompleted: true,
      });
    }

    const store = await storeRepository.findById(storeId);
    if (!store) {
      throw new ApiError(404, "Store listing not found.");
    }

    const storeVendorId = (store.vendorId?._id || store.vendorId).toString();
    if (storeVendorId !== vendor._id.toString()) {
      throw new ApiError(403, "Unauthorized to update this store listing.");
    }

    // Sync Store Branding back to Vendor Profile
    if (updateData.logo !== undefined || updateData.coverImage !== undefined) {
      const vendorUpdates = {};
      if (updateData.logo !== undefined) vendorUpdates.logo = updateData.logo;
      if (updateData.coverImage !== undefined)
        vendorUpdates.coverImage = updateData.coverImage;
      if (user?.email) vendorUpdates.email = user.email;

      await vendorRepository.updateProfile(vendor._id, vendorUpdates);
    }

    // Auto-update Store Slug if storeName changes
    if (updateData.storeName && !updateData.storeSlug) {
      updateData.storeSlug =
        updateData.storeName
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "") +
        "-" +
        Math.floor(Math.random() * 10000);
    }

    return await storeRepository.update(storeId, updateData);
  }

  async getStoresByVendor(vendorId) {
    return await storeRepository.findByVendorId(vendorId);
  }

  async getStoresByCity(city, pagination = { limit: 10, skip: 0 }) {
    const stores = await storeRepository.findByCity(city, pagination);
    const total = await storeRepository.count({
      isActive: true,
      city: new RegExp(city, "i"),
    });
    return { stores, total };
  }

  async getStoreById(storeId) {
    const store = await storeRepository.findById(storeId);
    if (!store) {
      throw new ApiError(404, "Store listing not found.");
    }
    return store;
  }

  async deleteStore(storeId, ownerId) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) {
      throw new ApiError(404, "Vendor profile not found.");
    }

    const store = await storeRepository.findById(storeId);
    if (!store) {
      throw new ApiError(404, "Store listing not found.");
    }

    const storeVendorId = (store.vendorId?._id || store.vendorId).toString();
    if (storeVendorId !== vendor._id.toString()) {
      throw new ApiError(403, "Unauthorized to delete this store listing.");
    }

    return await storeRepository.delete(storeId);
  }

  async getAllStores(query = {}, pagination = { limit: 10, skip: 0 }) {
    const stores = await storeRepository.findAll(query, pagination);
    const total = await storeRepository.count(query);
    return { stores, total };
  }
}

const storeService = new StoreService();
export default storeService;
