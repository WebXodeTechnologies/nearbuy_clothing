import { requireVendor } from "@/middleware/vendor.middleware";
import { validate } from "@/middleware/validate.middleware";
import { collectionSchema, updateCollectionSchema } from "@/validations/collection.schema";
import collectionService from "@/services/collection.service";
import collectionRepository from "@/repositories/collection.repository";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";

class CollectionController {
  async createCollection(req) {
    const user = await requireVendor(req);
    await dbConnect();

    const body = await req.json();
    const validatedData = validate(collectionSchema, body);

    const collection = await collectionService.createCollection(
      user.id,
      validatedData,
    );
    return ApiResponse.created(
      collection,
      "Collection lookbook created successfully",
    );
  }

  async getCollections(req) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const categoryId = searchParams.get("category");
    const vendorId = searchParams.get("vendor");
    const all = searchParams.get("all") === "true";

    let result;
    if (categoryId) {
      result = await collectionService.getCollectionsByCategory(categoryId, {
        limit,
        skip: (page - 1) * limit,
      });
    } else if (vendorId) {
      result = await collectionService.getCollectionsByVendor(vendorId, {
        limit,
        skip: (page - 1) * limit,
      });
    } else {
      const query = all ? {} : { isActive: true };
      const collections = await collectionRepository.findAll(query, {
        limit,
        skip: (page - 1) * limit,
      });
      const total = await collectionRepository.count(query);
      result = { collections, total };
    }

    return ApiResponse.success(
      { ...result, page, limit },
      "Collections retrieved successfully",
    );
  }

  async getCollectionById(req, { params }) {
    await dbConnect();
    const { id } = await params;

    const collection = await collectionService.getCollectionById(id);
    return ApiResponse.success(collection, "Collection retrieved successfully");
  }

  async updateCollection(req, { params }) {
    const user = await requireVendor(req);
    await dbConnect();
    const { id } = await params;

    const body = await req.json();
    const validatedData = validate(updateCollectionSchema, body);

    const collection = await collectionService.updateCollection(
      id,
      user.id,
      validatedData,
    );
    return ApiResponse.success(collection, "Collection updated successfully");
  }

  async deleteCollection(req, { params }) {
    const user = await requireVendor(req);
    await dbConnect();
    const { id } = await params;

    await collectionService.deleteCollection(id, user.id);
    return ApiResponse.success(null, "Collection deleted successfully");
  }
}

const collectionController = new CollectionController();
export default collectionController;
