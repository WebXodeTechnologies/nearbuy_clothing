import User from "@/models/User";
import UserSettings from "@/models/UserSettings";

class SettingsRepository {
  async findUserById(userId) {
    return await User.findById(userId).select("-password");
  }

  async updateUserProfile(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");
  }

  async findSettingsByUserId(userId) {
    let settings = await UserSettings.findOne({ userId });
    if (!settings) {
      settings = await UserSettings.create({ userId });
    }
    return settings;
  }

  async updateSettings(userId, notificationData) {
    return await UserSettings.findOneAndUpdate(
      { userId },
      { $set: { notifications: notificationData } },
      { new: true, upsert: true },
    );
  }
}

const settingsRepository = new SettingsRepository();
export default settingsRepository;
