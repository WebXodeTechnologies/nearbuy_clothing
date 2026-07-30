import subscriptionRepository from "@/repositories/subscription.repository";
import vendorRepository from "@/repositories/vendor.repository";
import ApiError from "@/utils/apiError";

class SubscriptionService {
  async createSubscription(ownerId, subscriptionData) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) {
      throw ApiError.notFound(
        "Vendor account required to purchase subscriptions.",
      );
    }

    // Calculate Expiry Date automatically based on Title Case billing cycle
    const startDate = new Date();
    const expiryDate = new Date(startDate);
    if (subscriptionData.billingCycle === "Yearly") {
      expiryDate.setFullYear(startDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(startDate.getMonth() + 1);
    }

    const subscription = await subscriptionRepository.create({
      ...subscriptionData,
      vendorId: vendor._id,
      startDate,
      expiryDate,
      paymentStatus: subscriptionData.paymentStatus || "Pending",
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
      throw ApiError.notFound("Subscription not found.");
    }

    const updateData = {
      paymentStatus,
      status: paymentStatus === "Paid" ? "Active" : "Expired",
    };

    if (paymentId) {
      updateData.razorpayPaymentId = paymentId;
    }

    return await subscriptionRepository.update(subscriptionId, updateData);
  }
}

const subscriptionService = new SubscriptionService();
export default subscriptionService;
