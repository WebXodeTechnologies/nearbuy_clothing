import { authenticate } from "./auth.middleware";
import { authorizeRole } from "./role.middleware";

/**
 * Middleware helper for Vendor & Admin API routes
 */
export async function requireVendor(req) {
  const user = await authenticate(req);
  authorizeRole(user, ["VENDOR", "ADMIN"]);
  return user;
}

export default requireVendor;
