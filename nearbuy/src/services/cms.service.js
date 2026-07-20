import CMS from "@/models/CMS";
import slugify from "@/lib/slugify";
import ApiError from "@/utils/apiError";

class CMSService {
  async getPageBySlug(slug) {
    const page = await CMS.findOne({ slug, isActive: true });
    if (!page) {
      throw new ApiError(404, "Page not found.");
    }
    return page;
  }

  async createPage(pageData) {
    const slug = slugify(pageData.title);
    const existing = await CMS.findOne({ slug });

    if (existing) {
      throw new ApiError(400, "CMS page with this title/slug already exists.");
    }

    return await CMS.create({
      ...pageData,
      slug,
    });
  }

  async updatePage(slug, updateData) {
    if (updateData.title) {
      updateData.slug = slugify(updateData.title);
    }
    return await CMS.findOneAndUpdate({ slug }, updateData, { new: true });
  }

  async getAllPages() {
    return await CMS.find().sort({ title: 1 });
  }
}

export default new CMSService();
