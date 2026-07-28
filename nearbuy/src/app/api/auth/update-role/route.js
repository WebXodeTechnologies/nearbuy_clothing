import { withErrorHandler } from "@/middleware/error.middleware";
import authController from "@/controllers/auth.controller";

export const POST = withErrorHandler(async (req) => {
  return await authController.updateRole(req);
});
