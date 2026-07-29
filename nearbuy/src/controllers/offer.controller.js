import { requireVendor } from "@/middleware/vendor.middleware";
import { validate } from "@/middleware/validate.middleware";
import { offerSchema, updateOfferSchema } from "@/validations/offer.schema";
import offerService from "@/services/offer.service";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";

class OfferController {
  async createOffer(req) {
    const user = await requireVendor(req);
    await dbConnect();

    const body = await req.json();
    const validatedData = validate(offerSchema, body);

    const offer = await offerService.createOffer(user.id, validatedData);
    return ApiResponse.created(
      offer,
      "Promotional offer launched successfully",
    );
  }

  async getOffers(req) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const vendorId = searchParams.get("vendor");
    const all = searchParams.get("all") === "true";

    let result;
    if (vendorId) {
      result = await offerService.getOffersByVendor(vendorId, {
        limit,
        skip: (page - 1) * limit,
      });
    } else if (all) {
      result = await offerService.getAllOffers(
        {},
        { limit, skip: (page - 1) * limit },
      );
    } else {
      result = await offerService.getActiveOffers({
        limit,
        skip: (page - 1) * limit,
      });
    }

    return ApiResponse.success(
      { ...result, page, limit },
      "Promotional offers retrieved successfully",
    );
  }

  async getOfferById(req, { params }) {
    await dbConnect();
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    const offer = await offerService.getOfferById(id);
    return ApiResponse.success(offer, "Offer retrieved successfully");
  }

  async updateOffer(req, { params }) {
    const user = await requireVendor(req);
    await dbConnect();
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    const body = await req.json();
    const validatedData = validate(updateOfferSchema, body);

    const offer = await offerService.updateOffer(id, user.id, validatedData);
    return ApiResponse.success(offer, "Offer updated successfully");
  }

  async deleteOffer(req, { params }) {
    const user = await requireVendor(req);
    await dbConnect();
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    await offerService.deleteOffer(id, user.id);
    return ApiResponse.success(null, "Offer deleted successfully");
  }
}

const offerController = new OfferController();
export default offerController;
