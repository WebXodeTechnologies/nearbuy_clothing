import { withErrorHandler } from "@/middleware/error.middleware";
import collectionController from "@/controllers/collection.controller";

export const POST = withErrorHandler(async (req) => {
  return await collectionController.createCollection(req);
});

export const GET = withErrorHandler(async (req) => {
  return await collectionController.getCollections(req);
});
