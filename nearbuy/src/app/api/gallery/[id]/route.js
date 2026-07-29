import { withErrorHandler } from "@/middleware/error.middleware";
import galleryController from "@/controllers/gallery.controller";

export const DELETE = withErrorHandler(async (req, context) => {
  return await galleryController.deleteAsset(req, context);
});
