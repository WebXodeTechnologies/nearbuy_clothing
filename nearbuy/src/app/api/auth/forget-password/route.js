import { NextResponse } from "next/server";
import { withErrorHandler } from "@/middleware/error.middleware";
import authController from "@/controllers/auth.controller";

export const POST = withErrorHandler(async (req) => {
  try {
    const result = await authController.forgotPassword(req);

    if (result instanceof NextResponse) {
      return result;
    }

    return NextResponse.json(
      result || {
        success: true,
        message: "Password reset instructions generated successfully.",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Forgot Password Route Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Bad Request" },
      { status: err.statusCode || 400 },
    );
  }
});
