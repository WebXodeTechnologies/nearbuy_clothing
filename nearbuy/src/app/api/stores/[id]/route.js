import { withErrorHandler } from "@/middleware/error.middleware";
import storeController from "@/controllers/store.controller";

export const GET = withErrorHandler(async (req, context) => {
  return await storeController.getStoreById(req, context);
});

export const PUT = withErrorHandler(async (req, context) => {
  return await storeController.updateStore(req, context);
});

export const DELETE = withErrorHandler(async (req, context) => {
  return await storeController.deleteStore(req, context);
});
