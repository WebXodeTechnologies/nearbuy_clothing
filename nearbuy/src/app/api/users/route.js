import { withErrorHandler } from "@/middleware/error.middleware";
import { requireAdmin } from "@/middleware/admin.middleware";
import userRepository from "@/repositories/user.repository";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const GET = withErrorHandler(async (req) => {
  await requireAdmin(req);
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  const users = await userRepository.findAll({}, { limit, skip });
  const total = await userRepository.count();

  return ApiResponse.success({ users, total, page, limit }, "Users retrieved successfully");
});
