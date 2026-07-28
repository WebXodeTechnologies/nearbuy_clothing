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
    const { id } = await params;

    const vendor = await vendorRepository.findById(id);
    return ApiResponse.success(vendor, "Vendor retrieved successfully");
  }

  async updateVendorProfile(req, { params }) {
    const user = await requireVendor(req);
    await dbConnect();
    const { id } = await params;

    const body = await req.json();
    const validatedData = validate(updateVendorProfileSchema, body);

    const updatedVendor = await vendorService.updateVendorProfile(
      id,
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
