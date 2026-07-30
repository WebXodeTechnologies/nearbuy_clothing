import { requireVendor } from "@/middleware/vendor.middleware";
import notificationService from "@/services/notification.service";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";

class NotificationController {
  async getNotifications(req) {
    const user = await requireVendor(req);
    await dbConnect();

    const notifications = await notificationService.getNotifications(user.id);
    return ApiResponse.success(
      notifications,
      "Notifications retrieved successfully",
    );
  }

  async markRead(req) {
    const user = await requireVendor(req);
    await dbConnect();

    const body = await req.json();

    if (body.markAll) {
      await notificationService.markAllRead(user.id);
      return ApiResponse.success(null, "All notifications marked as read");
    }

    if (body.id) {
      const notification = await notificationService.markSingleRead(
        user.id,
        body.id,
      );
      return ApiResponse.success(notification, "Notification marked as read");
    }

    throw ApiError.badRequest(
      "Invalid request body. 'markAll' or 'id' required.",
    );
  }
}

const notificationController = new NotificationController();
export default notificationController;
