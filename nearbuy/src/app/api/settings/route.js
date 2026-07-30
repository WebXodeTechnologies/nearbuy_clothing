import { withErrorHandler } from "@/middleware/error.middleware";
import settingsController from "@/controllers/settings.controller";

export const GET = withErrorHandler(async (req) => {
  return await settingsController.getSettings(req);
});

export const PUT = withErrorHandler(async (req) => {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  if (action === "password") {
    return await settingsController.updatePassword(req);
  }
  if (action === "notifications") {
    return await settingsController.updateNotifications(req);
  }

  return await settingsController.updateProfile(req);
});
