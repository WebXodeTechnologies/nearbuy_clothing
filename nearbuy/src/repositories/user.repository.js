import User from "@/models/User";

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
}

const userRepository = new UserRepository();
export default userRepository;
