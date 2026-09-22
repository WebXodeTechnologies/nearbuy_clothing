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
    console.log("📥 [Gallery API] Incoming Create Asset Body:", body);
    console.log("👤 [Gallery API] Authenticated Vendor ID:", user.id);

    const validatedData = validate(gallerySchema, body);
    const asset = await galleryService.createAsset(user.id, validatedData);

    console.log("✅ [Gallery API] Asset Saved Successfully:", asset._id);
    return ApiResponse.created(asset, "Asset saved to gallery");
  }

  async getAssets(req) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendor");

    console.log("🔍 [Gallery API] Fetching assets for vendorId:", vendorId);

    if (!vendorId) {
      return ApiResponse.success([], "Vendor ID missing");
    }

    const assets = await galleryService.getAssetsByVendor(vendorId);
    console.log(`📦 [Gallery API] Found ${assets.length} gallery assets.`);
    return ApiResponse.success(assets, "Gallery assets retrieved successfully");
  }

  async deleteAsset(req, { params }) {
    const user = await requireVendor(req);
    await dbConnect();
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    console.log("🗑️ [Gallery API] Deleting asset ID:", id);
    await galleryService.deleteAsset(id, user.id);
    return ApiResponse.success(null, "Asset deleted successfully");
  }
}

const galleryController = new GalleryController();
export default galleryController;
