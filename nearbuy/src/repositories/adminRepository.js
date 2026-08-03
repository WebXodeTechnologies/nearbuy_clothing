import dbConnect from "@/lib/db";
import Vendor from "@/models/Vendor";
import Store from "@/models/Store";
import User from "@/models/User";

class AdminRepository {
  async getSystemStats() {
    await dbConnect();

    const [totalStores, totalVendors, pendingVendors, totalUsers] =
      await Promise.all([
        Store.countDocuments({}),
        Vendor.countDocuments({}),
        Vendor.countDocuments({ status: { $in: ["Pending", "PENDING"] } }),
        User.countDocuments({}),
      ]);

    // Aggregate total store visits & views from Store collection
    const analytics = await Store.aggregate([
      {
        $group: {
          _id: null,
          totalVisits: { $sum: "$totalViews" },
          totalStoreViews: { $sum: "$totalViews" },
          totalWhatsappClicks: { $sum: "$totalWhatsappClicks" },
        },
      },
    ]);

    const stats = analytics[0] || {
      totalVisits: 0,
      totalStoreViews: 0,
      totalWhatsappClicks: 0,
    };

    return {
      totalStores,
      totalVendors,
      pendingVendors,
      totalUsers,
      totalVisits: stats.totalVisits,
      totalStoreViews: stats.totalStoreViews,
      totalWhatsappClicks: stats.totalWhatsappClicks,
    };
  }

  async findVendorsByStatus(status) {
    await dbConnect();
    const query = status ? { status: new RegExp(`^${status}$`, "i") } : {};
    return Vendor.find(query)
      .populate("ownerId", "name email image role")
      .sort({ createdAt: -1 });
  }

  async updateVendorStatus(vendorId, status) {
    await dbConnect();
    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { $set: { status, isActive: status.toUpperCase() === "APPROVED" } },
      { new: true, runValidators: true },
    );

    if (updatedVendor) {
      // Keep linked Store document status in sync
      await Store.findOneAndUpdate(
        { vendorId: updatedVendor._id },
        { $set: { status, isActive: status.toUpperCase() === "APPROVED" } },
      );
    }

    return updatedVendor;
  }
}

export default new AdminRepository();
