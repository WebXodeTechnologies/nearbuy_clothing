import Notification from "@/models/Notification";

class NotificationRepository {
  async create(data) {
    return await Notification.create(data);
  }

  async findByVendorId(vendorId, limit = 50) {
    return await Notification.find({ vendorId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async markAllAsRead(vendorId) {
    return await Notification.updateMany({ vendorId }, { unread: false });
  }

  async markByIdAsRead(id, vendorId) {
    return await Notification.findOneAndUpdate(
      { _id: id, vendorId },
      { unread: false },
      { new: true },
    );
  }

  async countUnread(vendorId) {
    return await Notification.countDocuments({ vendorId, unread: true });
  }
}

const notificationRepository = new NotificationRepository();
export default notificationRepository;
