import { withErrorHandler } from "@/middleware/error.middleware";
import offerController from "@/controllers/offer.controller";

export const GET = withErrorHandler(async (req, context) => {
  return await offerController.getOfferById(req, context);
});

export const PUT = withErrorHandler(async (req, context) => {
  return await offerController.updateOffer(req, context);
});

export const DELETE = withErrorHandler(async (req, context) => {
  return await offerController.deleteOffer(req, context);
});
