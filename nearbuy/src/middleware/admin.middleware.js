import { authenticate } from "./auth.middleware";
import { authorizeRole } from "./role.middleware";

/**
 * Middleware helper for Admin-only API routes
 */
export async function requireAdmin(req) {
  const user = await authenticate(req);
  authorizeRole(user, ["ADMIN"]);
  return user;
}

export default requireAdmin;
