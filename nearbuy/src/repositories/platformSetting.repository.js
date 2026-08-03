import PlatformSetting from "@/models/PlatformSetting";
import dbConnect from "@/lib/db";

class PlatformSettingRepository {
  async getSettings() {
    await dbConnect();
    let settings = await PlatformSetting.findOne();
    if (!settings) {
      settings = await PlatformSetting.create({});
    }
    return settings;
  }

  async updateSettings(updateData) {
    await dbConnect();
    let settings = await PlatformSetting.findOne();
    if (!settings) {
      return await PlatformSetting.create(updateData);
    }
    Object.assign(settings, updateData);
    await settings.save();
    return settings;
  }
}

export default new PlatformSettingRepository();
