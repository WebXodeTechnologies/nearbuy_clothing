import { authenticate } from "@/middleware/auth.middleware";
import { withErrorHandler } from "@/middleware/error.middleware";
import subscriptionRepository from "@/repositories/subscription.repository";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";

export const GET = withErrorHandler(async (req) => {
  const currentUser = await authenticate(req);
  if ((currentUser?.role || "").toUpperCase() !== "ADMIN") {
    throw new ApiError(403, "Access denied: Admin role required.");
  }

  const [rawSubscribers, plans] = await Promise.all([
    subscriptionRepository.findAllSubscribers(),
    subscriptionRepository.findAllPlans(),
  ]);

  // Format subscribers array safely for frontend consumption
  const subscribers = rawSubscribers.map((sub) => ({
    _id: sub._id,
    businessName:
      sub.vendorId?.businessName ||
      sub.vendorId?.storeName ||
      "Boutique Merchant",
    ownerName: sub.vendorId?.ownerName || "Merchant Owner",
    email: sub.vendorId?.email || "N/A",
    planName: sub.planId?.name || "Growth Pro",
    amount: sub.amount,
    status: sub.status,
    startDate: sub.startDate,
    nextBillingDate: sub.nextBillingDate,
    paymentMethod: sub.paymentMethod,
  }));

  return ApiResponse.success(
    { subscribers, plans },
    "Subscription financials retrieved",
  );
});
