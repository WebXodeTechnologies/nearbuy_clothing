import { requireVendor } from "@/middleware/vendor.middleware";
import { validate } from "@/middleware/validate.middleware";
import {
  updateProfileSchema,
  updatePasswordSchema,
  updateNotificationsSchema,
} from "@/validations/settings.schema";
import settingsService from "@/services/settings.service";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";

class SettingsController {
  async getSettings(req) {
    const user = await requireVendor(req);
    await dbConnect();
    const data = await settingsService.getUserSettings(user.id);
    return ApiResponse.success(data, "Settings retrieved successfully");
  }

  async updateProfile(req) {
    const user = await requireVendor(req);
    await dbConnect();

    const body = await req.json();
    const validatedData = validate(updateProfileSchema, body);
    const updatedUser = await settingsService.updateProfile(
      user.id,
      validatedData,
    );

    return ApiResponse.success(updatedUser, "Profile updated successfully");
  }

  async updatePassword(req) {
    const user = await requireVendor(req);
    await dbConnect();

    const body = await req.json();
    const validatedData = validate(updatePasswordSchema, body);
    await settingsService.updatePassword(user.id, validatedData);

    return ApiResponse.success(null, "Password updated successfully");
  }

  async updateNotifications(req) {
    const user = await requireVendor(req);
    await dbConnect();

    const body = await req.json();
    const validatedData = validate(updateNotificationsSchema, body);
    const updated = await settingsService.updateNotifications(
      user.id,
      validatedData,
    );

    return ApiResponse.success(updated, "Notification preferences updated");
  }
}

const settingsController = new SettingsController();
export default settingsController;
