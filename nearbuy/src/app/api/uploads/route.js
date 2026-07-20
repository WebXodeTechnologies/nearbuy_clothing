import { withErrorHandler } from "@/middleware/error.middleware";
import { authenticate } from "@/middleware/auth.middleware";
import ApiResponse from "@/utils/apiResponse";

export const POST = withErrorHandler(async (req) => {
  await authenticate(req);

  // Endpoint structure for Uploadthing or Cloudinary direct uploads signature
  return ApiResponse.success(
    {
      uploadUrl: "https://api.uploadthing.com/upload",
      provider: "uploadthing",
    },
    "Upload signature generated successfully"
  );
});
