import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/validations/auth.schema";
import authService from "@/services/auth.service";
import userRepository from "@/repositories/user.repository";
import Vendor from "@/models/Vendor";
import Store from "@/models/Store";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";

class AuthController {
  async register(req) {
    await dbConnect();
    const body = await req.json();

    // 🔒 STRICT SECURITY CHECK: Block public registration of ADMIN roles
    if (body.role && body.role.toUpperCase() === "ADMIN") {
      throw new ApiError(
        403,
        "Administrators cannot be created through public registration.",
      );
    }

    // Force role to be strictly VENDOR or USER
    if (body.role) {
      body.role = body.role.toUpperCase() === "VENDOR" ? "VENDOR" : "USER";
    }

    const validatedData = validate(registerSchema, body);

    // 1. Register the core user
    const user = await authService.registerUser(validatedData);

    // 2. AUTOMATIC VENDOR & STORE SETUP (If role is VENDOR)
    const userRole = (user?.role || validatedData.role || "").toUpperCase();
    if (userRole === "VENDOR") {
      const userId = user._id || user.id;
      const userName = user.name || validatedData.name || "Store";

      const defaultSlug =
        userName
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-") +
        "-" +
        Date.now().toString().slice(-4);

      // Check if vendor profile already exists to prevent duplicate creation
      let existingVendor = await Vendor.findOne({ ownerId: userId });
      if (!existingVendor) {
        // Create Vendor Profile
        existingVendor = await Vendor.create({
          ownerId: userId,
          businessName: `${userName}'s Store`,
          storeName: `${userName}'s Store`,
          slug: defaultSlug,
          businessSlug: defaultSlug,
          city: "Namakkal",
          status: "Approved", // Auto-approved for instant publishing
        });
      }

      // Check if store profile already exists
      let existingStore = await Store.findOne({ vendorId: existingVendor._id });
      if (!existingStore) {
        // Create Store Profile for Frontend Directory (address included to satisfy Store schema requirement)
        await Store.create({
          vendorId: existingVendor._id,
          storeName: existingVendor.businessName,
          storeSlug: defaultSlug,
          description: "Welcome to our local storefront on Nearbuy.",
          address: "Namakkal Main Road", // 👈 Required field in Store schema
          city: "Namakkal",
          isActive: true, // Instantly visible on the customer directory & homepage!
        });
      }

      // Link vendorId back to User model
      await userRepository.updateById(userId, {
        vendorId: existingVendor._id,
        profileCompleted: true,
      });
    }

    return ApiResponse.created(
      user,
      "User registered and store published successfully",
    );
  }

  async forgotPassword(req) {
    await dbConnect();
    const body = await req.json();
    const validatedData = validate(forgotPasswordSchema, body);

    const result = await authService.forgotPassword(validatedData.email);
    return ApiResponse.success(result, "Password reset token generated");
  }

  async resetPassword(req) {
    await dbConnect();
    const body = await req.json();
    const validatedData = validate(resetPasswordSchema, body);

    await authService.resetPassword(
      validatedData.token,
      validatedData.newPassword,
    );
    return ApiResponse.success(
      null,
      "Password reset successfully. You can now login.",
    );
  }

  async getProfile(req) {
    const activeUser = await authenticate(req);
    await dbConnect();

    const user = await userRepository.findById(activeUser.id);
    if (!user) throw new ApiError(404, "User profile not found.");

    return ApiResponse.success(user, "Profile retrieved successfully");
  }
}

const authController = new AuthController();
export default authController;
