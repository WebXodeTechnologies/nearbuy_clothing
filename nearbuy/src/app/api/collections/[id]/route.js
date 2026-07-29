import { withErrorHandler } from "@/middleware/error.middleware";
import collectionController from "@/controllers/collection.controller";

export const GET = withErrorHandler(async (req, context) => {
  return await collectionController.getCollectionById(req, context);
});

export const PUT = withErrorHandler(async (req, context) => {
  return await collectionController.updateCollection(req, context);
});

export const PATCH = PUT; // Alias for PATCH requests

export const DELETE = withErrorHandler(async (req, context) => {
  return await collectionController.deleteCollection(req, context);
});
