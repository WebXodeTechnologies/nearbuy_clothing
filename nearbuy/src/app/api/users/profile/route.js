import { withErrorHandler } from "@/middleware/error.middleware";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { updateUserProfileSchema } from "@/validations/user.schema";
import authService from "@/services/auth.service";
import userRepository from "@/repositories/user.repository";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const GET = withErrorHandler(async (req) => {
  const activeUser = await authenticate(req);
  await dbConnect();

  const user = await authService.getUserProfile(activeUser.id);
  return ApiResponse.success(user, "Profile retrieved successfully");
});

export const PUT = withErrorHandler(async (req) => {
  const activeUser = await authenticate(req);
  await dbConnect();

  const body = await req.json();
  const validatedData = validate(updateUserProfileSchema, body);

  const updatedUser = await userRepository.updateProfile(activeUser.id, validatedData);
  return ApiResponse.success(updatedUser, "Profile updated successfully");
});
