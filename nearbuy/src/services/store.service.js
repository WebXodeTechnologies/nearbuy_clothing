import storeRepository from "@/repositories/store.repository";
import vendorRepository from "@/repositories/vendor.repository";
import ApiError from "@/utils/apiError";

class StoreService {
  async createStore(ownerId, storeData) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) {
      throw new ApiError(404, "Vendor profile required to create a store listing.");
    }

    if (vendor.status !== "Approved") {
      throw new ApiError(403, "Vendor application must be approved before adding store listings.");
    }

    return await storeRepository.create({
      ...storeData,
      vendorId: vendor._id,
    });
  }

  async getStoresByVendor(vendorId) {
    return await storeRepository.findByVendorId(vendorId);
  }

  async getStoresByCity(city, pagination = { limit: 10, skip: 0 }) {
    const stores = await storeRepository.findByCity(city, pagination);
    const total = await storeRepository.count({ status: "Active", city: new RegExp(city, "i") });
    return { stores, total };
  }

  async getStoreById(storeId) {
    const store = await storeRepository.findById(storeId);
    if (!store) {
      throw new ApiError(404, "Store listing not found.");
    }
    return store;
  }

  async updateStore(storeId, vendorId, updateData) {
    const store = await storeRepository.findById(storeId);
    if (!store) {
      throw new ApiError(404, "Store listing not found.");
    }

    if (store.vendorId._id.toString() !== vendorId.toString()) {
      throw new ApiError(403, "Unauthorized to update this store listing.");
    }

    return await storeRepository.update(storeId, updateData);
  }

  async deleteStore(storeId, vendorId) {
    const store = await storeRepository.findById(storeId);
    if (!store) {
      throw new ApiError(404, "Store listing not found.");
    }

    if (store.vendorId._id.toString() !== vendorId.toString()) {
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

