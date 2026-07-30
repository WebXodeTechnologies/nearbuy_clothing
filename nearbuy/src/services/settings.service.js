import settingsRepository from "@/repositories/settings.repository";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import ApiError from "@/utils/apiError";

class SettingsService {
  async getUserSettings(userId) {
    const user = await settingsRepository.findUserById(userId);
    const settings = await settingsRepository.findSettingsByUserId(userId);
    return { user, notifications: settings.notifications };
  }

  async updateProfile(userId, profileData) {
    return await settingsRepository.updateUserProfile(userId, profileData);
  }

  async updatePassword(userId, { currentPassword, newPassword }) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("User not found.");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw ApiError.badRequest("Current password does not match.");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return true;
  }

  async updateNotifications(userId, notificationData) {
    return await settingsRepository.updateSettings(userId, notificationData);
  }
}

const settingsService = new SettingsService();
export default settingsService;
