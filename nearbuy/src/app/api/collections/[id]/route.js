import { withErrorHandler } from "@/middleware/error.middleware";
import { requireVendor } from "@/middleware/vendor.middleware";
import { validate } from "@/middleware/validate.middleware";
import { updateCollectionSchema } from "@/validations/collection.schema";
import collectionService from "@/services/collection.service";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const GET = withErrorHandler(async (req, { params }) => {
  await dbConnect();
  const { id } = await params;

  const collection = await collectionService.getCollectionById(id);
  return ApiResponse.success(collection, "Collection retrieved successfully");
});

export const PUT = withErrorHandler(async (req, { params }) => {
  const user = await requireVendor(req);
  await dbConnect();
  const { id } = await params;

  const body = await req.json();
  const validatedData = validate(updateCollectionSchema, body);

  const collection = await collectionService.updateCollection(id, user.id, validatedData);
  return ApiResponse.success(collection, "Collection updated successfully");
});

export const DELETE = withErrorHandler(async (req, { params }) => {
  const user = await requireVendor(req);
  await dbConnect();
  const { id } = await params;

  await collectionService.deleteCollection(id, user.id);
  return ApiResponse.success(null, "Collection deleted successfully");
});
