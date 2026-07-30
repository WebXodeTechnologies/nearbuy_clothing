import { authenticate } from "@/middleware/auth.middleware";
import { requireVendor } from "@/middleware/vendor.middleware";
import { requireAdmin } from "@/middleware/admin.middleware";
import { validate } from "@/middleware/validate.middleware";
import {
  vendorRegisterSchema,
  updateVendorProfileSchema,
  updateVendorStatusSchema,
} from "@/validations/vendor.schema";
import vendorService from "@/services/vendor.service";
import vendorRepository from "@/repositories/vendor.repository";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";

class VendorController {
  async registerVendor(req) {
    const user = await authenticate(req);
    await dbConnect();

    const body = await req.json();
    const validatedData = validate(vendorRegisterSchema, body);

    const vendor = await vendorService.registerVendor(user.id, validatedData);
    return ApiResponse.created(
      vendor,
      "Vendor application submitted successfully",
    );
  }

  async getVendors(req) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status");

    const query = {};
    if (status) query.status = status;

    const result = await vendorService.getAllVendors(query, {
      limit,
      skip: (page - 1) * limit,
    });
    return ApiResponse.success(
      { ...result, page, limit },
      "Vendors retrieved successfully",
    );
  }

  async getVendorById(req, { params }) {
    await dbConnect();
    const resolvedParams = params ? await params : {};
    const { id } = resolvedParams;

    const vendor = await vendorRepository.findById(id);
    if (!vendor) {
      throw new ApiError(404, "Vendor store not found.");
    }
    return ApiResponse.success(vendor, "Vendor retrieved successfully");
  }

  /**
   * FIX: Fetch current logged-in vendor's profile automatically
   */
  async getMyVendorProfile(req) {
    const user = await requireVendor(req);
    await dbConnect();

    const vendor = await vendorRepository.findByOwnerId(user.id);
    if (!vendor) {
      throw new ApiError(404, "Vendor profile not found for this account.");
    }

    return ApiResponse.success(vendor, "Vendor profile retrieved successfully");
  }

  /**
   * FIX: Updates vendor profile scoped to the authenticated user's store
   */
  async updateVendorProfile(req, context = {}) {
    const user = await requireVendor(req);
    await dbConnect();

    // Extract ID if provided in URL params, otherwise locate vendor by user.id
    const resolvedParams = context.params ? await context.params : {};
    let targetVendorId = resolvedParams.id;

    // Find the vendor document owned by this user
    let vendor = await vendorRepository.findByOwnerId(user.id);

    if (!vendor && targetVendorId) {
      vendor = await vendorRepository.findById(targetVendorId);
    }

    if (!vendor) {
      throw new ApiError(404, "Vendor store profile not found to update.");
    }

    // Security Check: Verify ownership unless user is Admin
    if (String(vendor.ownerId) !== String(user.id) && user.role !== "ADMIN") {
      throw new ApiError(
        403,
        "You do not have permission to modify this store.",
      );
    }

    const body = await req.json();
    const validatedData = validate(updateVendorProfileSchema, body);

    // Perform update on vendor._id
    const updatedVendor = await vendorService.updateVendorProfile(
      vendor._id,
      validatedData,
    );

    return ApiResponse.success(
      updatedVendor,
      "Vendor profile updated successfully",
    );
  }

  async updateStatus(req) {
    await requireAdmin(req);
    await dbConnect();

    const body = await req.json();
    const { vendorId, status } = body;

    validate(updateVendorStatusSchema, { status });

    const vendor = await vendorService.updateStatus(vendorId, status);
    return ApiResponse.success(
      vendor,
      `Vendor status updated to '${status}' successfully`,
    );
  }
}

const vendorController = new VendorController();
export default vendorController;
