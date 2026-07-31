import { authenticate, requireAdmin } from "@/middleware/auth.middleware";
import dbConnect from "@/lib/db";
import vendorRepository from "@/repositories/vendor.repository";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";
import { withErrorHandler } from "@/middleware/error.middleware";

// GET /api/vendors/[id] -> Public / Protected Vendor lookup
export const GET = withErrorHandler(async (req, { params }) => {
  await dbConnect();
  const { id } = await params;

  const vendor = await vendorRepository.findById(id);
  if (!vendor) {
    throw new ApiError(404, "Vendor store not found.");
  }

  return ApiResponse.success(vendor, "Vendor retrieved successfully");
});

// PATCH /api/vendors/[id] -> Admin or Owner update by store ID
export const PATCH = withErrorHandler(async (req, { params }) => {
  const user = await authenticate(req);
  await dbConnect();

  const { id } = await params;
  const vendor = await vendorRepository.findById(id);

  if (!vendor) {
    throw new ApiError(404, "Vendor store not found.");
  }

  // Verify ownership unless Admin
  if (String(vendor.ownerId._id) !== String(user.id) && user.role !== "ADMIN") {
    throw new ApiError(403, "You do not have permission to modify this store.");
  }

  const body = await req.json();
  const updatedVendor = await vendorRepository.updateProfile(id, body);

  return ApiResponse.success(
    updatedVendor,
    "Vendor store updated successfully",
  );
});
