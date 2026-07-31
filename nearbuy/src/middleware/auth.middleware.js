import { getServerSession } from "next-auth/next";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/config/auth.config";
import ApiError from "@/utils/apiError";

/**
 * Universal Authentication Helper for Next.js App Router API Routes
 * @param {Request} req - Incoming Next.js Request object
 */
export async function authenticate(req) {
  // 1. Check Server Session (Works in Browser when cookies are attached)
  try {
    const session = await getServerSession(authOptions);
    if (session?.user) {
      return session.user;
    }
  } catch (err) {
    // Session lookup failed, fall through
  }

  // 2. Check NextAuth Token via cookies or request headers
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token) {
      return {
        id: token.id || token.sub,
        email: token.email,
        name: token.name,
        role: (token.role || "USER").toUpperCase(),
        vendorId: token.vendorId || null,
      };
    }
  } catch (err) {
    // Token lookup failed, fall through
  }

  // 3. Manual Fallback: Check Cookie Header directly from `req.headers`
  const authHeader =
    req?.headers?.get("authorization") || req?.headers?.get("Authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.split(" ")[1];
    if (bearerToken) {
      try {
        const decodedToken = await getToken({
          req: {
            headers: {
              cookie: `next-auth.session-token=${bearerToken}; __Secure-next-auth.session-token=${bearerToken}`,
            },
          },
          secret: process.env.NEXTAUTH_SECRET,
        });

        if (decodedToken) {
          return {
            id: decodedToken.id || decodedToken.sub,
            email: decodedToken.email,
            name: decodedToken.name,
            role: (decodedToken.role || "USER").toUpperCase(),
            vendorId: decodedToken.vendorId || null,
          };
        }
      } catch (e) {
        // Fallback failed
      }
    }
  }

  throw new ApiError(401, "Authentication required. Please log in.");
}

/**
 * Require Merchant Vendor or Admin Access
 */
export async function requireVendor(req) {
  const user = await authenticate(req);
  const userRole = (user.role || "").toUpperCase();

  if (userRole !== "VENDOR" && userRole !== "ADMIN") {
    throw new ApiError(
      403,
      "Access denied: Merchant Vendor privileges required.",
    );
  }

  return user;
}

/**
 * Require Administrator Access
 */
export async function requireAdmin(req) {
  const user = await authenticate(req);
  const userRole = (user.role || "").toUpperCase();

  if (userRole !== "ADMIN") {
    throw new ApiError(
      403,
      "Access denied: Administrator privileges required.",
    );
  }

  return user;
}

/**
 * Require Customer/Regular User Access
 */
export async function requireCustomer(req) {
  const user = await authenticate(req);
  return user;
}

export default authenticate;
