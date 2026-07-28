import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { registerSchema } from "@/validations/auth.schema";
import { updateUserProfileSchema } from "@/validations/user.schema";
import authService from "@/services/auth.service";
import userRepository from "@/repositories/user.repository";
import vendorRepository from "@/repositories/vendor.repository";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth.config";
import User from "@/models/User";

class AuthController {
  async register(req) {
    await dbConnect();
    const body = await req.json();
    const validatedData = validate(registerSchema, body);

    const user = await authService.registerUser(validatedData);
    return ApiResponse.created(user, "User registered successfully");
  }

  async updateRole(req) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      throw new ApiError(401, "Unauthorized");
    }

    const body = await req.json().catch(() => ({}));
    const rawRole = body.role;
    if (!rawRole) {
      throw new ApiError(400, "Role parameter is required");
    }

    let normalizedRole = String(rawRole).toUpperCase().trim();
    if (normalizedRole === "CUSTOMER") normalizedRole = "USER";

    if (!["USER", "VENDOR", "ADMIN"].includes(normalizedRole)) {
      throw new ApiError(400, `Invalid role: ${rawRole}`);
    }

    await dbConnect();

    const email = session.user.email.toLowerCase().trim();
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: session.user.name || email.split("@")[0],
        email: email,
        image: session.user.image || "",
        role: normalizedRole,
      });
    } else {
      user.role = normalizedRole;
      await user.save();
    }

    return ApiResponse.success({
      message: "Role updated successfully",
      role: user.role,
    });
  }

  async getProfile(req) {
    const activeUser = await authenticate(req);
    await dbConnect();

    const user = await authService.getUserProfile(activeUser.id);
    const userObj = user.toObject ? user.toObject() : { ...user };

    if (userObj.role === "VENDOR") {
      const vendor = await vendorRepository.findByOwnerId(activeUser.id);
      if (vendor) {
        userObj.phone = vendor.phone;
      }
    }

    return ApiResponse.success(userObj, "Profile retrieved successfully");
  }

  async updateProfile(req) {
    const activeUser = await authenticate(req);
    await dbConnect();

    const body = await req.json();
    const validatedData = validate(updateUserProfileSchema, body);

    const updatedUser = await userRepository.updateProfile(
      activeUser.id,
      validatedData,
    );
    const userObj = updatedUser.toObject
      ? updatedUser.toObject()
      : { ...updatedUser };

    if (userObj.role === "VENDOR") {
      const vendor = await vendorRepository.findByOwnerId(activeUser.id);
      if (vendor) {
        if (validatedData.phone) {
          const updatedVendor = await vendorRepository.updateProfile(vendor._id, {
            phone: validatedData.phone,
          });
          userObj.phone = updatedVendor.phone;
        } else {
          userObj.phone = vendor.phone;
        }
      }
    }

    return ApiResponse.success(userObj, "Profile updated successfully");
  }

  async deleteProfile(req) {
    const activeUser = await authenticate(req);
    await dbConnect();

    await authService.deleteUserProfile(activeUser.id);
    return ApiResponse.success(null, "User profile deleted successfully");
  }
}

const authController = new AuthController();
export default authController;
