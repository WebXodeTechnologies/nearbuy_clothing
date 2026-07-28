import { withErrorHandler } from "@/middleware/error.middleware";
import storeController from "@/controllers/store.controller";

export const GET = withErrorHandler(async (req) => {
  return await storeController.searchStores(req);
});