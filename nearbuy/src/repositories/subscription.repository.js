import Subscription from "@/models/Subscription";
import Plan from "@/models/Plan";
import dbConnect from "@/lib/db";

class SubscriptionRepository {
  // ==========================================
  // Subscription Methods
  // ==========================================

  async create(subscriptionData) {
    await dbConnect();
    return await Subscription.create(subscriptionData);
  }

  async findById(id) {
    await dbConnect();
    return await Subscription.findById(id).populate(
      "vendorId",
      "businessName businessSlug email phone ownerId",
    );
  }

  async findByVendorId(vendorId) {
    await dbConnect();
    return await Subscription.findOne({ vendorId }).sort({ createdAt: -1 });
  }

  async update(id, updateData) {
    await dbConnect();
    return await Subscription.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findAll(query = {}, pagination = { limit: 50, skip: 0 }) {
    await dbConnect();
    return await Subscription.find(query)
      .populate("vendorId", "businessName businessSlug email phone ownerId")
      .populate(
        "planId",
        "name price billingCycle displayOrder maxStores maxCollections",
      )
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);
  }

  async count(query = {}) {
    await dbConnect();
    return await Subscription.countDocuments(query);
  }

  // ==========================================
  // Plan Tier Methods (Required for Admin)
  // ==========================================

  async findAllPlans(query = {}) {
    await dbConnect();
    return await Plan.find(query).sort({ displayOrder: 1, price: 1 });
  }

  async findPlanById(id) {
    await dbConnect();
    return await Plan.findById(id);
  }

  async createPlan(planData) {
    await dbConnect();
    return await Plan.create(planData);
  }

  async updatePlan(id, updateData) {
    await dbConnect();
    return await Plan.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }
}

export default new SubscriptionRepository();
