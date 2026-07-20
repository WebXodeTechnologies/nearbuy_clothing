import { withErrorHandler } from "@/middleware/error.middleware";
import { validate } from "@/middleware/validate.middleware";
import { registerSchema } from "@/validations/auth.schema";
import authService from "@/services/auth.service";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const POST = withErrorHandler(async (req) => {
  await dbConnect();
  const body = await req.json();
  const validatedData = validate(registerSchema, body);

  const user = await authService.registerUser(validatedData);

  return ApiResponse.created(user, "User registered successfully");
});
