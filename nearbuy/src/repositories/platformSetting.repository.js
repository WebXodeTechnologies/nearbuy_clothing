import Setting from "@/models/Setting";
import dbConnect from "@/lib/db";

class PlatformSettingRepository {
  async getSettings() {
    await dbConnect();
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    return settings;
  }

  async updateSettings(updateData) {
    await dbConnect();
    let settings = await Setting.findOne();
    if (!settings) {
      return await Setting.create(updateData);
    }
    Object.assign(settings, updateData);
    await settings.save();
    return settings;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new PlatformSettingRepository();
