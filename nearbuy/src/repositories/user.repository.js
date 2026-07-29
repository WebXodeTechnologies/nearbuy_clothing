import mongoose from "mongoose";
import User from "@/models/User";

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    if (!email) return null;
    return await User.findOne({ email: email.toLowerCase().trim() });
  }

  async findById(id) {
    if (!id) return null;

    // Handle non-standard / static Admin fallback IDs
    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      id === "nearbuy-admin-static-id" ||
      id === "000000000000000000000001"
    ) {
      const adminUser = await User.findOne({
        email: "nearbuyadmin1@nearbuy.com",
      })
        .select("-password")
        .lean();

      if (adminUser) return adminUser;

      return {
        _id: id,
        name: "Nearbuy Admin",
        email: "nearbuyadmin1@nearbuy.com",
        role: "ADMIN",
        phone: "+91 99999 99999",
        image: "",
        isActive: true,
      };
    }

    return await User.findById(id).select("-password").lean();
  }

  async updateRole(id, role) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    return await User.findByIdAndUpdate(
      id,
      { $set: { role: role.toUpperCase().trim() } },
      { new: true, runValidators: true },
    ).select("-password");
  }

  async updateProfile(id, updateData) {
    // Sanitize update payload to prevent accidental role or password overwrites
    const sanitizedUpdates = {
      ...(updateData.name && { name: updateData.name }),
      ...(updateData.phone && { phone: updateData.phone }),
      ...(updateData.image && { image: updateData.image }),
      ...(updateData.designation && { designation: updateData.designation }),
      ...(updateData.bio && { bio: updateData.bio }),
    };

    // If ID is not a valid ObjectId (or static Admin ID), update by Admin Email in MongoDB
    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      id === "nearbuy-admin-static-id" ||
      id === "000000000000000000000001"
    ) {
      return await User.findOneAndUpdate(
        { email: "nearbuyadmin1@nearbuy.com" },
        { $set: sanitizedUpdates },
        { new: true, upsert: true, runValidators: true },
      ).select("-password");
    }

    // Standard MongoDB ObjectId update
    return await User.findByIdAndUpdate(
      id,
      { $set: sanitizedUpdates },
      { new: true, runValidators: true },
    ).select("-password");
  }

  async deleteProfile(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return await User.findOneAndDelete({
        email: "nearbuyadmin1@nearbuy.com",
      });
    }
    return await User.findByIdAndDelete(id);
  }

  async findAll(query = {}, pagination = { limit: 10, skip: 0 }) {
    return await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean();
  }

  async count(query = {}) {
    return await User.countDocuments(query);
  }
}

const userRepository = new UserRepository();
export default userRepository;
