import User from "@/models/User";

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase().trim() });
  }

  async findById(id) {
    return await User.findById(id).select("-password");
  }

  async updateRole(id, role) {
    return await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
  }

  async updateProfile(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
  }

  async findAll(query = {}, pagination = { limit: 10, skip: 0 }) {
    return await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);
  }

  async count(query = {}) {
    return await User.countDocuments(query);
  }
}

export default new UserRepository();
