import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/validations/auth.schema";
import authService from "@/services/auth.service";
import userRepository from "@/repositories/user.repository";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";

class AuthController {
  async register(req) {
    await dbConnect();
    const body = await req.json();
    const validatedData = validate(registerSchema, body);

    const user = await authService.registerUser(validatedData);
    return ApiResponse.created(user, "User registered successfully");
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
