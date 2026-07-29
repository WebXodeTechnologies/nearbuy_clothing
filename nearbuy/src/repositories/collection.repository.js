import Collection from "@/models/Collection";
import "@/models/Vendor";
import "@/models/Store";
import "@/models/Category";

class CollectionRepository {
  async create(collectionData) {
    return await Collection.create(collectionData);
  }

  async findById(id) {
    return await Collection.findById(id)
      .populate("vendorId", "businessName businessSlug logo phone whatsapp")
      .populate("storeId", "storeName storeSlug city area")
      .populate("categoryIds", "name slug image")
      .lean();
  }

  async findByVendorId(vendorId, pagination = { limit: 10, skip: 0 }) {
    return await Collection.find({ vendorId })
      .populate("categoryIds", "name slug image")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean();
  }

  async findByCategory(categoryId, pagination = { limit: 10, skip: 0 }) {
    return await Collection.find({ categoryIds: categoryId, isActive: true })
      .populate("vendorId", "businessName businessSlug logo")
      .populate("storeId", "storeName storeSlug city area")
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean();
  }

  async findAll(query = {}, pagination = { limit: 10, skip: 0 }) {
    return await Collection.find(query)
      .populate("vendorId", "businessName businessSlug logo")
      .populate("storeId", "storeName storeSlug city area")
      .populate("categoryIds", "name slug image")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean();
  }

  async update(id, updateData) {
    return await Collection.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );
  }

  async delete(id) {
    return await Collection.findByIdAndDelete(id);
  }

  async count(query = {}) {
    return await Collection.countDocuments(query);
  }
}

const collectionRepository = new CollectionRepository();
export default collectionRepository;
