import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Resend } from "resend";
import userRepository from "@/repositories/user.repository";
import ApiError from "@/utils/apiError";

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

class AuthService {
  async registerUser({ name, email, password, role = "USER" }) {
    const normalizedEmail = email.toLowerCase().trim();
    let user = await userRepository.findByEmail(normalizedEmail, true);

    const hashedPassword = await bcrypt.hash(password, 10);
    let normalizedRole = (role || "USER").toUpperCase().trim();
    if (normalizedRole === "CUSTOMER") normalizedRole = "USER";

    // Generate Verification Token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    if (user) {
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
      user.verificationToken = verificationToken;
      user.verificationTokenExpiry = verificationTokenExpiry;
      await user.save();
    } else {
      // New registration
      user = await userRepository.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        provider: "credentials",
        role: normalizedRole,
        isEmailVerified: false,
        verificationToken,
        verificationTokenExpiry,
        storageUsedBytes: 0,
      });
    }

    // 🚀 Send Email Verification via Resend
    const verificationLink = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verificationToken}`;

    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: [normalizedEmail],
        subject: "Verify Your Nearbuy Account",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
            <h2 style="color: #0f172a;">Welcome to Nearbuy, ${name}!</h2>
            <p style="color: #334155;">Please verify your email address to activate your account by clicking below:</p>
            <a href="${verificationLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; margin: 20px 0;">Verify Email</a>
            <p style="color: #64748b; font-size: 12px;">If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send verification email:", emailErr);
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

    // 🚀 Send Password Reset Email via Resend
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: [normalizedEmail],
        subject: "Reset Your Nearbuy Password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2>Password Reset Request</h2>
            <p>Click the link below to reset your password. This link is valid for 1 hour.</p>
            <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 15px 0;">Reset Password</a>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send password reset email:", emailErr);
    }

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
