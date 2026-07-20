import { withErrorHandler } from "@/middleware/error.middleware";
import { requireVendor } from "@/middleware/vendor.middleware";
import { validate } from "@/middleware/validate.middleware";
import { updateStoreSchema } from "@/validations/store.schema";
import storeService from "@/services/store.service";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const GET = withErrorHandler(async (req, { params }) => {
  await dbConnect();
  const { id } = await params;

  const store = await storeService.getStoreById(id);
  return ApiResponse.success(store, "Store listing retrieved successfully");
});

export const PUT = withErrorHandler(async (req, { params }) => {
  const user = await requireVendor(req);
  await dbConnect();
  const { id } = await params;

  const body = await req.json();
  const validatedData = validate(updateStoreSchema, body);

  const updatedStore = await storeService.updateStore(id, user.id, validatedData);
  return ApiResponse.success(updatedStore, "Store listing updated successfully");
});

export const DELETE = withErrorHandler(async (req, { params }) => {
  const user = await requireVendor(req);
  await dbConnect();
  const { id } = await params;

  await storeService.deleteStore(id, user.id);
  return ApiResponse.success(null, "Store listing deleted successfully");
});
