import ApiError from "@/utils/apiError";

/**
 * Middleware function to enforce Role-Based Access Control (RBAC)
 * @param {Object} user - User object from session
 * @param {Array<string>} allowedRoles - Allowed roles (e.g. ['ADMIN', 'VENDOR'])
 */
export function authorizeRole(user, allowedRoles = []) {
  if (!user || !user.role) {
    throw new ApiError(401, "User authentication role missing.");
  }

  const normalizedUserRole = user.role.toUpperCase();
  const normalizedAllowedRoles = allowedRoles.map((r) => r.toUpperCase());

  if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
    throw new ApiError(403, `Forbidden. Role '${user.role}' is not authorized to access this resource.`);
  }

  return true;
}

export default authorizeRole;
