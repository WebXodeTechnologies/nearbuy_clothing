import { withErrorHandler } from "@/middleware/error.middleware";
import { requireVendor } from "@/middleware/vendor.middleware";
import { validate } from "@/middleware/validate.middleware";
import { offerSchema } from "@/validations/offer.schema";
import offerService from "@/services/offer.service";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const POST = withErrorHandler(async (req) => {
  const user = await requireVendor(req);
  await dbConnect();

  const body = await req.json();
  const validatedData = validate(offerSchema, body);

  const offer = await offerService.createOffer(user.id, validatedData);
  return ApiResponse.created(offer, "Offer created successfully");
});

export const GET = withErrorHandler(async (req) => {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const vendorId = searchParams.get("vendor");

  if (vendorId) {
    const offers = await offerService.getOffersByVendor(vendorId);
    return ApiResponse.success({ offers }, "Vendor offers retrieved successfully");
  }

  const result = await offerService.getActiveOffers({ limit, skip: (page - 1) * limit });
  return ApiResponse.success({ ...result, page, limit }, "Active promotional offers retrieved successfully");
});
