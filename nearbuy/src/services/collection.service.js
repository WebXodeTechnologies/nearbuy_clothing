import collectionRepository from "@/repositories/collection.repository";
import vendorRepository from "@/repositories/vendor.repository";
import ApiError from "@/utils/apiError";

class CollectionService {
  async createCollection(ownerId, collectionData) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) {
      throw new ApiError(404, "Vendor profile required to create collections.");
    }

    return await collectionRepository.create({
      ...collectionData,
      vendorId: vendor._id,
    });
  }

  async getCollectionsByVendor(vendorId, pagination = { limit: 10, skip: 0 }) {
    const collections = await collectionRepository.findByVendorId(vendorId, pagination);
    const total = await collectionRepository.count({ vendorId });
    return { collections, total };
  }

  async getCollectionsByCategory(categoryId, pagination = { limit: 10, skip: 0 }) {
    const collections = await collectionRepository.findByCategory(categoryId, pagination);
    const total = await collectionRepository.count({ categoryId, status: true });
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
    const collection = await collectionRepository.findById(id);

    if (!collection) {
      throw new ApiError(404, "Collection lookbook not found.");
    }

    if (collection.vendorId._id.toString() !== vendor._id.toString()) {
      throw new ApiError(403, "Unauthorized to modify this collection.");
    }

    return await collectionRepository.update(id, updateData);
  }

  async deleteCollection(id, ownerId) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    const collection = await collectionRepository.findById(id);

    if (!collection) {
      throw new ApiError(404, "Collection lookbook not found.");
    }

    if (collection.vendorId._id.toString() !== vendor._id.toString()) {
      throw new ApiError(403, "Unauthorized to delete this collection.");
    }

    return await collectionRepository.delete(id);
  }
}

export default new CollectionService();
