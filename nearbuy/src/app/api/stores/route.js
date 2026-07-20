import { withErrorHandler } from "@/middleware/error.middleware";
import { requireVendor } from "@/middleware/vendor.middleware";
import { validate } from "@/middleware/validate.middleware";
import { storeSchema } from "@/validations/store.schema";
import storeService from "@/services/store.service";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const POST = withErrorHandler(async (req) => {
  const user = await requireVendor(req);
  await dbConnect();

  const body = await req.json();
  const validatedData = validate(storeSchema, body);

  const store = await storeService.createStore(user.id, validatedData);
  return ApiResponse.created(store, "Store listing created successfully");
});

export const GET = withErrorHandler(async (req) => {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const result = await storeService.getStoresByCity(city, { limit, skip: (page - 1) * limit });
  return ApiResponse.success({ ...result, page, limit }, "Stores retrieved successfully");
});
