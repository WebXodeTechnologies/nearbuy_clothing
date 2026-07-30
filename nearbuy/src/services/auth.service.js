import bcrypt from "bcryptjs";
import crypto from "crypto";
import userRepository from "@/repositories/user.repository";
import ApiError from "@/utils/apiError";

class AuthService {
  async registerUser({ name, email, password, role = "USER" }) {
    const normalizedEmail = email.toLowerCase().trim();
    let user = await userRepository.findByEmail(normalizedEmail, true);

    const hashedPassword = await bcrypt.hash(password, 10);
    let normalizedRole = (role || "USER").toUpperCase().trim();
    if (normalizedRole === "CUSTOMER") normalizedRole = "USER";

    if (user) {
      // User exists with password already set
      if (user.password) {
        throw new ApiError(
          400,
          "An account with this email address already exists. Please sign in.",
        );
      }

      // Existing Google user attaching a password for the first time
      user.password = hashedPassword;
      user.role = normalizedRole;
      user.provider = "credentials";
      await user.save();
    } else {
      // New registration
      user = await userRepository.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        provider: "credentials",
        role: normalizedRole,
      });
    }

    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;
    return userObj;
  }

  async validateCredentials(email, password) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await userRepository.findByEmail(normalizedEmail, true);

    if (!user) {
      throw new ApiError(404, "No account found with this email address.");
    }

    if (!user.password) {
      throw new ApiError(
        400,
        "This account uses Google Login. Please sign in with Google or request a password reset.",
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new ApiError(401, "Invalid password credentials.");
    }

    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;
    return userObj;
  }

  async forgotPassword(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
      return {
        success: true,
        message: "If account exists, token will be generated.",
      };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour token expiration

    await userRepository.updateResetToken(user._id, token, expires);

    return { token, email: user.email };
  }

  async resetPassword(token, newPassword) {
    const user = await userRepository.findByResetToken(token);
    if (!user) {
      throw new ApiError(400, "Invalid or expired password reset token.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.updatePasswordAndClearToken(user._id, hashedPassword);

    return true;
  }
}

const authService = new AuthService();
export { authService };
export default authService;
