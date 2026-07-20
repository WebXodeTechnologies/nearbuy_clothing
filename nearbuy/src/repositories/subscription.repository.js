import Subscription from "@/models/Subscription";

class SubscriptionRepository {
  async create(subscriptionData) {
    return await Subscription.create(subscriptionData);
  }

  async findById(id) {
    return await Subscription.findById(id).populate("vendorId", "businessName businessSlug email phone");
  }

  async findByVendorId(vendorId) {
    return await Subscription.findOne({ vendorId }).sort({ createdAt: -1 });
  }

  async updateStatus(id, paymentStatus, status = "Active") {
    return await Subscription.findByIdAndUpdate(
      id,
      { paymentStatus, status },
      { new: true }
    );
  }

  async findAll(query = {}, pagination = { limit: 10, skip: 0 }) {
    return await Subscription.find(query)
      .populate("vendorId", "businessName businessSlug email phone")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);
  }

  async count(query = {}) {
    return await Subscription.countDocuments(query);
  }
}

export default new SubscriptionRepository();
