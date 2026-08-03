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
    subscriptionRepository.findAll({}, { limit: 100, skip: 0 }), // Fixed method call from findAllSubscribers to findAll
    subscriptionRepository.findAllPlans(),
  ]);

  // Format subscribers array safely for frontend consumption
  const subscribers = rawSubscribers.map((sub) => ({
    _id: sub._id,
    businessName:
      sub.vendorId?.businessName ||
      sub.vendorId?.storeName ||
      "Boutique Merchant",
    ownerName:
      sub.vendorId?.ownerName || sub.vendorId?.email || "Merchant Owner",
    email: sub.vendorId?.email || "N/A",
    planName: sub.planName || sub.planId?.name || "Growth Pro",
    amount: sub.amount,
    status: sub.status,
    startDate: sub.startDate,
    nextBillingDate: sub.expiryDate, // Mapped schema expiryDate to frontend nextBillingDate
    paymentMethod: sub.paymentMethod,
  }));

  return ApiResponse.success(
    { subscribers, plans },
    "Subscription financials retrieved",
  );
});
