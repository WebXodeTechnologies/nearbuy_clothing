import User from "@/models/User";
import dbConnect from "@/lib/db";

class UserRepository {
  async findById(id) {
    return await User.findById(id);
  }

  async findByEmail(email, selectPassword = false) {
    const query = User.findOne({ email: email.toLowerCase().trim() });
    if (selectPassword) {
      query.select("+password");
    }
    return await query;
  }

  async findByResetToken(token) {
    return await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");
  }

  async create(userData) {
    return await User.create(userData);
  }

  async updateProfile(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async updateResetToken(id, token, expires) {
    return await User.findByIdAndUpdate(id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });
  }

  async findAll({ page = 1, limit = 10, search = "", role = "" } = {}) {
    await dbConnect();
    const query = { isDeleted: { $ne: true } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role && role !== "ALL") {
      query.role = role.toUpperCase();
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .populate("vendorId", "businessName storeName status")
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    return {
      users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async updatePasswordAndClearToken(id, hashedPassword) {
    return await User.findByIdAndUpdate(id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }

  async deleteProfile(id) {
    return await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  /**
   * FIX: Added missing count method for Dashboard Stats calculation
   */
  async count(query = {}) {
    return await User.countDocuments(query);
  }
}

const userRepository = new UserRepository();
export default userRepository;
