import { withErrorHandler } from "@/middleware/error.middleware";
import notificationController from "@/controllers/notification.controller";

export const GET = withErrorHandler(async (req) => {
  return await notificationController.getNotifications(req);
});

export const PATCH = withErrorHandler(async (req) => {
  return await notificationController.markRead(req);
});
