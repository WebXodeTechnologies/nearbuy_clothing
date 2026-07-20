import { withErrorHandler } from "@/middleware/error.middleware";
import { requireVendor } from "@/middleware/vendor.middleware";
import { validate } from "@/middleware/validate.middleware";
import { collectionSchema } from "@/validations/collection.schema";
import collectionService from "@/services/collection.service";
import collectionRepository from "@/repositories/collection.repository";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const POST = withErrorHandler(async (req) => {
  const user = await requireVendor(req);
  await dbConnect();

  const body = await req.json();
  const validatedData = validate(collectionSchema, body);

  const collection = await collectionService.createCollection(user.id, validatedData);
  return ApiResponse.created(collection, "Collection lookbook created successfully");
});

export const GET = withErrorHandler(async (req) => {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const categoryId = searchParams.get("category");
  const vendorId = searchParams.get("vendor");

  let result;
  if (categoryId) {
    result = await collectionService.getCollectionsByCategory(categoryId, { limit, skip: (page - 1) * limit });
  } else if (vendorId) {
    result = await collectionService.getCollectionsByVendor(vendorId, { limit, skip: (page - 1) * limit });
  } else {
    const collections = await collectionRepository.findAll({ status: true }, { limit, skip: (page - 1) * limit });
    const total = await collectionRepository.count({ status: true });
    result = { collections, total };
  }

  return ApiResponse.success({ ...result, page, limit }, "Collections retrieved successfully");
});
