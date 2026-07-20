import Banner from "@/models/Banner";

class BannerService {
  async getActiveBanners() {
    return await Banner.find({ isActive: true }).sort({ createdAt: -1 });
  }

  async getAllBanners() {
    return await Banner.find().sort({ createdAt: -1 });
  }

  async createBanner(bannerData) {
    return await Banner.create(bannerData);
  }

  async updateBanner(id, updateData) {
    return await Banner.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteBanner(id) {
    return await Banner.findByIdAndDelete(id);
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new BannerService();
