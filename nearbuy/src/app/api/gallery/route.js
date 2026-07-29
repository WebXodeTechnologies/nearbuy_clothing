import { withErrorHandler } from "@/middleware/error.middleware";
import galleryController from "@/controllers/gallery.controller";

export const POST = withErrorHandler(async (req) => {
  return await galleryController.createAsset(req);
});

export const GET = withErrorHandler(async (req) => {
  return await galleryController.getAssets(req);
});
