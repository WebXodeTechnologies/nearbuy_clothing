import { withErrorHandler } from "@/middleware/error.middleware";
import { requireVendor } from "@/middleware/vendor.middleware";
import { validate } from "@/middleware/validate.middleware";
import { updateOfferSchema } from "@/validations/offer.schema";
import offerService from "@/services/offer.service";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const GET = withErrorHandler(async (req, { params }) => {
  await dbConnect();
  const { id } = await params;

  const offer = await offerService.getOfferById(id);
  return ApiResponse.success(offer, "Offer retrieved successfully");
});

export const PUT = withErrorHandler(async (req, { params }) => {
  const user = await requireVendor(req);
  await dbConnect();
  const { id } = await params;

  const body = await req.json();
  const validatedData = validate(updateOfferSchema, body);

  const offer = await offerService.updateOffer(id, user.id, validatedData);
  return ApiResponse.success(offer, "Offer updated successfully");
});

export const DELETE = withErrorHandler(async (req, { params }) => {
  const user = await requireVendor(req);
  await dbConnect();
  const { id } = await params;

  await offerService.deleteOffer(id, user.id);
  return ApiResponse.success(null, "Offer deleted successfully");
});
