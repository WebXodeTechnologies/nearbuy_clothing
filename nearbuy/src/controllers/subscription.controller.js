import { requireVendor } from "@/middleware/vendor.middleware";
import { validate } from "@/middleware/validate.middleware";
import { subscriptionSchema } from "@/validations/subscription.schema";
import subscriptionService from "@/services/subscription.service";
import vendorService from "@/services/vendor.service";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";

class SubscriptionController {
  async createSubscription(req) {
    const user = await requireVendor(req);
    await dbConnect();

    const body = await req.json();

    // Validate body directly without mutating string casing
    const validatedData = validate(subscriptionSchema, body);

    const subscription = await subscriptionService.createSubscription(
      user.id,
      validatedData,
    );

    return ApiResponse.created(
      subscription,
      "Subscription initialized successfully",
    );
  }

  async getSubscription(req) {
    const user = await requireVendor(req);
    await dbConnect();

    const vendor = await vendorService.getVendorByOwner(user.id);
    if (!vendor) {
      throw ApiError.notFound("Vendor profile not found.");
    }

    const subscription = await subscriptionService.getVendorSubscription(
      vendor._id,
    );

    return ApiResponse.success(
      subscription,
      "Subscription retrieved successfully",
    );
  }
}

const subscriptionController = new SubscriptionController();
export default subscriptionController;
