import { authenticate } from "@/middleware/auth.middleware";
import { withErrorHandler } from "@/middleware/error.middleware";
import userRepository from "@/repositories/user.repository";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";

export const PATCH = withErrorHandler(async (req, { params }) => {
  const currentUser = await authenticate(req);
  if ((currentUser?.role || "").toUpperCase() !== "ADMIN") {
    throw new ApiError(
      403,
      "Access denied: Platform Administrator role required.",
    );
  }

  const { id } = await params;
  const body = await req.json();
  const { role } = body;

  if (!role) {
    throw new ApiError(400, "New role is required.");
  }

  const updatedUser = await userRepository.updateRole(id, role);
  if (!updatedUser) {
    throw new ApiError(404, "User not found.");
  }

  return ApiResponse.success(updatedUser, "User role updated successfully");
});
