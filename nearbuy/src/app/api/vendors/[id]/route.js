import { withErrorHandler } from "@/middleware/error.middleware";
import { requireVendor } from "@/middleware/vendor.middleware";
import { validate } from "@/middleware/validate.middleware";
import { updateVendorProfileSchema } from "@/validations/vendor.schema";
import vendorService from "@/services/vendor.service";
import vendorRepository from "@/repositories/vendor.repository";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";

export const GET = withErrorHandler(async (req, { params }) => {
  await dbConnect();
  const { id } = await params;

  const vendor = await vendorRepository.findById(id);
  return ApiResponse.success(vendor, "Vendor retrieved successfully");
});

export const PUT = withErrorHandler(async (req, { params }) => {
  const user = await requireVendor(req);
  await dbConnect();
  const { id } = await params;

  const body = await req.json();
  const validatedData = validate(updateVendorProfileSchema, body);

  const updatedVendor = await vendorService.updateVendorProfile(id, validatedData);
  return ApiResponse.success(updatedVendor, "Vendor profile updated successfully");
});
