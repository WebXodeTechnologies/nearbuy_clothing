import { requireVendor } from "@/middleware/vendor.middleware";
import { validate } from "@/middleware/validate.middleware";
import { gallerySchema } from "@/validations/gallery.schema";
import galleryService from "@/services/gallery.service";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";

class GalleryController {
  async createAsset(req) {
    const user = await requireVendor(req);
    await dbConnect();

    const body = await req.json();
    const validatedData = validate(gallerySchema, body);

    const asset = await galleryService.createAsset(user.id, validatedData);
    return ApiResponse.created(asset, "Asset saved to gallery");
  }

  async getAssets(req) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendor");

    if (!vendorId) {
      return ApiResponse.success([], "Vendor ID missing");
    }

    const assets = await galleryService.getAssetsByVendor(vendorId);
    return ApiResponse.success(assets, "Gallery assets retrieved successfully");
  }

  async deleteAsset(req, { params }) {
    const user = await requireVendor(req);
    await dbConnect();
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    await galleryService.deleteAsset(id, user.id);
    return ApiResponse.success(null, "Asset deleted successfully");
  }
}

const galleryController = new GalleryController();
export default galleryController;
