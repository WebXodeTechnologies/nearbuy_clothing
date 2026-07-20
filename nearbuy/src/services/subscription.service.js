import subscriptionRepository from "@/repositories/subscription.repository";
import vendorRepository from "@/repositories/vendor.repository";
import ApiError from "@/utils/apiError";

class SubscriptionService {
  async createSubscription(ownerId, subscriptionData) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) {
      throw new ApiError(404, "Vendor account required to purchase subscriptions.");
    }

    const subscription = await subscriptionRepository.create({
      ...subscriptionData,
      vendorId: vendor._id,
      paymentStatus: "Pending",
      status: "Active",
    });

    // Link subscription to Vendor
    await vendorRepository.updateProfile(vendor._id, {
      subscriptionId: subscription._id,
    });

    return subscription;
  }

  async getVendorSubscription(vendorId) {
    return await subscriptionRepository.findByVendorId(vendorId);
  }

  async updatePaymentStatus(subscriptionId, paymentStatus, paymentId = "") {
    const subscription = await subscriptionRepository.findById(subscriptionId);
    if (!subscription) {
      throw new ApiError(404, "Subscription not found.");
    }

    const updateData = { paymentStatus };
    if (paymentId) updateData.paymentId = paymentId;

    return await subscriptionRepository.updateStatus(
      subscriptionId,
      paymentStatus,
      paymentStatus === "Paid" ? "Active" : "Expired"
    );
  }
}

const subscriptionService = new SubscriptionService();
export default subscriptionService;

