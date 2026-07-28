import { withErrorHandler } from "@/middleware/error.middleware";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { updateUserProfileSchema } from "@/validations/user.schema";
import authService from "@/services/auth.service";
import userRepository from "@/repositories/user.repository";
import vendorRepository from "@/repositories/vendor.repository";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const GET = withErrorHandler(async (req) => {
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
});

export const PUT = withErrorHandler(async (req) => {
  const activeUser = await authenticate(req);
  await dbConnect();

  const body = await req.json();
  const validatedData = validate(updateUserProfileSchema, body);

  const updatedUser = await userRepository.updateProfile(activeUser.id, validatedData);
  const userObj = updatedUser.toObject ? updatedUser.toObject() : { ...updatedUser };

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
});

export const DELETE = withErrorHandler(async (req) => {
  const activeUser = await authenticate(req);
  await dbConnect();

  await authService.deleteUserProfile(activeUser.id);
  return ApiResponse.success(null, "User profile deleted successfully");
});
