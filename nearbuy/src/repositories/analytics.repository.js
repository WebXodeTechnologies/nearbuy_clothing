import Analytics from "@/models/Analytics";

class AnalyticsRepository {
  async logEvent(eventData) {
    return await Analytics.create(eventData);
  }

  async getEventsByVendor(vendorId, options = { limit: 100 }) {
    return await Analytics.find({ vendorId })
      .sort({ createdAt: -1 })
      .limit(options.limit)
      .lean();
  }

  async getEventCountByType(vendorId = null, eventType, startDate = null) {
    const filter = { eventType: eventType.toUpperCase() };
    if (vendorId) filter.vendorId = vendorId;
    if (startDate) filter.createdAt = { $gte: startDate };

    return await Analytics.countDocuments(filter);
  }

  async getPlatformStats(startDate = null) {
    const filter = (eventType) => {
      const query = { eventType: eventType.toUpperCase() };
      if (startDate) query.createdAt = { $gte: startDate };
      return query;
    };

    const totalVisits = await Analytics.countDocuments(filter("WEBSITE_VISIT"));
    const totalStoreViews = await Analytics.countDocuments(
      filter("STORE_VIEW"),
    );
    const totalWhatsappClicks = await Analytics.countDocuments(
      filter("WHATSAPP_CLICK"),
    );
    const totalPhoneClicks = await Analytics.countDocuments(
      filter("PHONE_CLICK"),
    );

    return {
      totalVisits,
      totalStoreViews,
      totalWhatsappClicks,
      totalPhoneClicks,
    };
  }
}

const analyticsRepository = new AnalyticsRepository();
export default analyticsRepository;
