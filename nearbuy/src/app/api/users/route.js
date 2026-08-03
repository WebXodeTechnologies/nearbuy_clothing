import { authenticate } from "@/middleware/auth.middleware";
import { withErrorHandler } from "@/middleware/error.middleware";
import userRepository from "@/repositories/user.repository";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";

// GET /api/users -> List all users with search, role filters & pagination
export const GET = withErrorHandler(async (req) => {
  const currentUser = await authenticate(req);

  const userRole = (currentUser?.role || "").toUpperCase();
  if (userRole !== "ADMIN") {
    throw new ApiError(
      403,
      "Access denied: Platform Administrator role required.",
    );
  }

  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "ALL";

  const data = await userRepository.findAll({ page, limit, search, role });

  return ApiResponse.success(data, "Users directory fetched successfully");
});
