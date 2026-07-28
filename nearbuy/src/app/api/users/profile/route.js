import { withErrorHandler } from "@/middleware/error.middleware";
import authController from "@/controllers/auth.controller";

export const GET = withErrorHandler(async (req) => {
  return await authController.getProfile(req);
});

export const PUT = withErrorHandler(async (req) => {
  return await authController.updateProfile(req);
});

export const DELETE = withErrorHandler(async (req) => {
  return await authController.deleteProfile(req);
});
