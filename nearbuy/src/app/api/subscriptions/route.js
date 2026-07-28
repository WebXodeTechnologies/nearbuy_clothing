import { withErrorHandler } from "@/middleware/error.middleware";
import subscriptionController from "@/controllers/subscription.controller";

export const POST = withErrorHandler(async (req) => {
  return await subscriptionController.createSubscription(req);
});

export const GET = withErrorHandler(async (req) => {
  return await subscriptionController.getSubscription(req);
});
