import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middleware/error.middleware";
import authController from "@/controllers/auth.controller";

export const POST = withErrorHandler(async (req) => {
  const result = await authController.resetPassword(req);

  // If the controller already returned a NextResponse or custom response object, return it directly
  if (result instanceof NextResponse) {
    return result;
  }

  // Otherwise, wrap the result into a guaranteed JSON response
  return NextResponse.json(
    result || {
      success: true,
      message: "Password reset successfully. You can now login.",
    },
    { status: 200 },
  );
});
