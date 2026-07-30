import notificationRepository from "@/repositories/notification.repository";
import vendorRepository from "@/repositories/vendor.repository";
import ApiError from "@/utils/apiError";

class NotificationService {
  async getNotifications(ownerId) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) {
      throw ApiError.notFound("Vendor profile not found.");
    }
    return await notificationRepository.findByVendorId(vendor._id);
  }

  async markAllRead(ownerId) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) {
      throw ApiError.notFound("Vendor profile not found.");
    }
    return await notificationRepository.markAllAsRead(vendor._id);
  }

  async markSingleRead(ownerId, notificationId) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) {
      throw ApiError.notFound("Vendor profile not found.");
    }
    const updated = await notificationRepository.markByIdAsRead(
      notificationId,
      vendor._id,
    );
    if (!updated) {
      throw ApiError.notFound("Notification not found or access denied.");
    }
    return updated;
  }

  async createNotification(vendorId, payload) {
    return await notificationRepository.create({
      vendorId,
      ...payload,
    });
  }
}

const notificationService = new NotificationService();
export default notificationService;
