import { withErrorHandler } from "@/middleware/error.middleware";
import offerController from "@/controllers/offer.controller";

export const POST = withErrorHandler(async (req) => {
  return await offerController.createOffer(req);
});

export const GET = withErrorHandler(async (req) => {
  return await offerController.getOffers(req);
});
