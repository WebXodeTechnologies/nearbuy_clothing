import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth.config";
import ApiError from "@/utils/apiError";

/**
 * Middleware helper to authenticate requests in API Routes
 * @returns {Promise<{ id: string, email: string, role: string, name?: string }>} Active User Session
 */
export async function authenticate(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new ApiError(401, "Authentication required. Please log in.");
  }

  return session.user;
}

export default authenticate;
