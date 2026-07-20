import { withErrorHandler } from "@/middleware/error.middleware";
import { requireVendor } from "@/middleware/vendor.middleware";
import { validate } from "@/middleware/validate.middleware";
import { subscriptionSchema } from "@/validations/subscription.schema";
import subscriptionService from "@/services/subscription.service";
import vendorService from "@/services/vendor.service";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const POST = withErrorHandler(async (req) => {
  const user = await requireVendor(req);
  await dbConnect();

  const body = await req.json();
  const validatedData = validate(subscriptionSchema, body);

  const subscription = await subscriptionService.createSubscription(user.id, validatedData);
  return ApiResponse.created(subscription, "Subscription order initialized successfully");
});

export const GET = withErrorHandler(async (req) => {
  const user = await requireVendor(req);
  await dbConnect();

  const vendor = await vendorService.getVendorByOwner(user.id);
  const subscription = await subscriptionService.getVendorSubscription(vendor._id);

  return ApiResponse.success(subscription, "Subscription retrieved successfully");
});
