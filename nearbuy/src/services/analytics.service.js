import analyticsRepository from "@/repositories/analytics.repository";

class AnalyticsService {
  async trackEvent({ eventType, vendorId = null, storeId = null, userId = null, metadata = {} }) {
    const validEvents = [
      "website_visit",
      "store_view",
      "whatsapp_click",
      "phone_click",
      "maps_click",
      "category_view",
      "vendor_login",
    ];

    if (!validEvents.includes(eventType)) {
      return null;
    }

    return await analyticsRepository.logEvent({
      eventType,
      vendorId,
      storeId,
      userId,
      metadata,
    });
  }

  async getVendorMetrics(vendorId) {
    const storeViews = await analyticsRepository.getEventCountByType(vendorId, "store_view");
    const whatsappClicks = await analyticsRepository.getEventCountByType(vendorId, "whatsapp_click");
    const phoneClicks = await analyticsRepository.getEventCountByType(vendorId, "phone_click");
    const mapsClicks = await analyticsRepository.getEventCountByType(vendorId, "maps_click");

    return {
      storeViews,
      whatsappClicks,
      phoneClicks,
      mapsClicks,
      totalLeads: whatsappClicks + phoneClicks + mapsClicks,
    };
  }

  async getPlatformMetrics() {
    return await analyticsRepository.getPlatformStats();
  }
}

const analyticsService = new AnalyticsService();
export default analyticsService;

