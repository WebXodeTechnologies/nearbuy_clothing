import { authenticate } from "@/middleware/auth.middleware";
import ApiError from "@/utils/apiError";

export async function verifyAdmin(req) {
  const user = await authenticate(req);
  const role = (user?.role || "").toUpperCase();

  if (role !== "ADMIN") {
    throw new ApiError(
      403,
      "Access restricted: Administrator credentials required.",
    );
  }

  return user;
}
