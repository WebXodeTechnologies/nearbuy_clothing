import { withErrorHandler } from "@/middleware/error.middleware";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { vendorRegisterSchema } from "@/validations/vendor.schema";
import vendorService from "@/services/vendor.service";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const POST = withErrorHandler(async (req) => {
  const user = await authenticate(req);
  await dbConnect();

  const body = await req.json();
  const validatedData = validate(vendorRegisterSchema, body);

  const vendor = await vendorService.registerVendor(user.id, validatedData);
  return ApiResponse.created(vendor, "Vendor application submitted successfully");
});

export const GET = withErrorHandler(async (req) => {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const status = searchParams.get("status");

  const query = {};
  if (status) query.status = status;

  const result = await vendorService.getAllVendors(query, { limit, skip: (page - 1) * limit });
  return ApiResponse.success({ ...result, page, limit }, "Vendors retrieved successfully");
});
