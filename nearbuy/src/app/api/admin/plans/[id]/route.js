import { authenticate } from "@/middleware/auth.middleware";
import { withErrorHandler } from "@/middleware/error.middleware";
import subscriptionRepository from "@/repositories/subscription.repository";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";

export const PUT = withErrorHandler(async (req, { params }) => {
  const currentUser = await authenticate(req);
  if ((currentUser?.role || "").toUpperCase() !== "ADMIN") {
    throw new ApiError(
      403,
      "Access denied: Platform Administrator role required.",
    );
  }

  const { id } = await params;
  const body = await req.json();

  const updatedPlan = await subscriptionRepository.updatePlan(id, body);
  if (!updatedPlan) {
    throw new ApiError(404, "Subscription tier plan not found.");
  }

  return ApiResponse.success(updatedPlan, "Plan tier updated successfully");
});
