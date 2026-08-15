import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import userRepository from "@/repositories/user.repository";
import { authenticate } from "@/middleware/auth.middleware";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";
import { withErrorHandler } from "@/middleware/error.middleware";

// GET: Fetch user profile
export const GET = withErrorHandler(async (req) => {
  const activeUser = await authenticate(req);
  await dbConnect();

  const user = await userRepository.findById(activeUser.id);
  if (!user) throw new ApiError(404, "User profile not found.");

  return NextResponse.json({ success: true, data: user }, { status: 200 });
});

// PUT: Update user profile
export const PUT = withErrorHandler(async (req) => {
  const activeUser = await authenticate(req);
  await dbConnect();

  const body = await req.json();
  const updatedUser = await userRepository.updateById(activeUser.id, body);
  if (!updatedUser) throw new ApiError(404, "User not found to update.");

  return NextResponse.json(
    {
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    },
    { status: 200 },
  );
});

// DELETE: Delete user profile
export const DELETE = withErrorHandler(async (req) => {
  const activeUser = await authenticate(req);
  await dbConnect();

  const deleted = await userRepository.deleteById(activeUser.id);
  if (!deleted) throw new ApiError(404, "User not found to delete.");

  return NextResponse.json(
    { success: true, message: "Profile deleted successfully" },
    { status: 200 },
  );
});
