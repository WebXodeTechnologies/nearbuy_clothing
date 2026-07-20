import Analytics from "@/models/Analytics";

class AnalyticsRepository {
  async logEvent(eventData) {
    return await Analytics.create(eventData);
  }

  async getEventsByVendor(vendorId, options = { limit: 100 }) {
    return await Analytics.find({ vendorId })
      .sort({ createdAt: -1 })
      .limit(options.limit);
  }

  async getEventsByStore(storeId, options = { limit: 100 }) {
    return await Analytics.find({ storeId })
      .sort({ createdAt: -1 })
      .limit(options.limit);
  }

  async getEventCountByType(vendorId = null, eventType) {
    const filter = { eventType };
    if (vendorId) filter.vendorId = vendorId;
    return await Analytics.countDocuments(filter);
  }

  async getPlatformStats() {
    const totalVisits = await Analytics.countDocuments({ eventType: "website_visit" });
    const totalStoreViews = await Analytics.countDocuments({ eventType: "store_view" });
    const totalWhatsappClicks = await Analytics.countDocuments({ eventType: "whatsapp_click" });
    const totalPhoneClicks = await Analytics.countDocuments({ eventType: "phone_click" });

    return {
      totalVisits,
      totalStoreViews,
      totalWhatsappClicks,
      totalPhoneClicks,
    };
  }
}

export default new AnalyticsRepository();
