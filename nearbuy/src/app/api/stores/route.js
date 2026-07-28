import { withErrorHandler } from "@/middleware/error.middleware";
import storeController from "@/controllers/store.controller";

export const POST = withErrorHandler(async (req) => {
  return await storeController.createStore(req);
});

export const GET = withErrorHandler(async (req) => {
  return await storeController.getStores(req);
});
