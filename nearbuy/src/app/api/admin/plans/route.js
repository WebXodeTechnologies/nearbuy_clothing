import { authenticate } from "@/middleware/auth.middleware";
import { withErrorHandler } from "@/middleware/error.middleware";
import subscriptionRepository from "@/repositories/subscription.repository";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";

export const POST = withErrorHandler(async (req) => {
  const currentUser = await authenticate(req);
  if ((currentUser?.role || "").toUpperCase() !== "ADMIN") {
    throw new ApiError(
      403,
      "Access denied: Platform Administrator role required.",
    );
  }

  const body = await req.json();

  if (!body.name || body.price === undefined) {
    throw new ApiError(400, "Plan name and price are required.");
  }

  // Generate slug automatically if missing
  if (!body.slug) {
    body.slug = body.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");
  }

  const newPlan = await subscriptionRepository.createPlan(body);
  return ApiResponse.created(
    newPlan,
    "New subscription tier created successfully",
  );
});
