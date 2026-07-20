import bcrypt from "bcryptjs";
import userRepository from "@/repositories/user.repository";
import ApiError from "@/utils/apiError";

class AuthService {
  async registerUser({ name, email, password, role = "USER" }) {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new ApiError(400, "An account with this email address already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }

  async validateCredentials(email, password) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new ApiError(404, "No account found with this email address.");
    }

    if (!user.password) {
      throw new ApiError(400, "This account uses Google Login. Please sign in with Google.");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new ApiError(401, "Invalid password credentials.");
    }

    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }

  async getUserProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User profile not found.");
    }
    return user;
  }
}

export default new AuthService();
