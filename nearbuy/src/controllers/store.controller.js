import { requireVendor } from "@/middleware/vendor.middleware";
import { validate } from "@/middleware/validate.middleware";
import { storeSchema, updateStoreSchema } from "@/validations/store.schema";
import storeService from "@/services/store.service";
import vendorRepository from "@/repositories/vendor.repository";
import storeRepository from "@/repositories/store.repository";
import Store from "@/models/Store";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";
import mongoose from "mongoose";
import ApiError from "@/utils/apiError";

class StoreController {
  async createStore(req) {
    const user = await requireVendor(req);
    await dbConnect();

    const body = await req.json();
    const validatedData = validate(storeSchema, body);

    const store = await storeService.createStore(user.id, validatedData);
    return ApiResponse.created(store, "Store listing created successfully");
  }

  async getStores(req) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const vendor = searchParams.get("vendor");
    const all = searchParams.get("all") === "true";

    let result;
    if (vendor) {
      const stores = await storeService.getStoresByVendor(vendor);
      result = { stores, total: stores.length };
    } else if (all) {
      result = await storeService.getAllStores(
        {},
        { limit, skip: (page - 1) * limit },
      );
    } else {
      result = await storeService.getStoresByCity(city, {
        limit,
        skip: (page - 1) * limit,
      });
    }

    return ApiResponse.success(
      { ...result, page, limit },
      "Stores retrieved successfully",
    );
  }

  async getStoreById(req, { params }) {
    await dbConnect();
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    let store;
    if (mongoose.Types.ObjectId.isValid(id)) {
      store = await storeService.getStoreById(id);
    } else {
      // 1. First attempt direct Store Slug lookup
      store = await Store.findOne({ storeSlug: id.toLowerCase().trim() })
        .populate(
          "vendorId",
          "businessName businessSlug logo coverImage phone email",
        )
        .populate("categoryIds", "name slug image")
        .lean();

      // 2. If not found by storeSlug, fallback to Vendor Slug lookup
      if (!store) {
        const vendor = await vendorRepository.findBySlug(id);
        if (vendor) {
          const stores = await storeService.getStoresByVendor(vendor._id);
          if (stores && stores.length > 0) {
            store = stores[0];
          }
        }
      }

      if (!store) {
        throw new ApiError(404, "Store listing not found.");
      }
    }

    return ApiResponse.success(store, "Store listing retrieved successfully");
  }

  async updateStore(req, { params }) {
    const user = await requireVendor(req);
    await dbConnect();
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    const body = await req.json();
    const validatedData = validate(updateStoreSchema, body);

    const updatedStore = await storeService.updateStore(
      id,
      user.id,
      validatedData,
    );

    return ApiResponse.success(
      updatedStore,
      "Store listing updated successfully",
    );
  }

  async deleteStore(req, { params }) {
    const user = await requireVendor(req);
    await dbConnect();
    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    await storeService.deleteStore(id, user.id);
    return ApiResponse.success(null, "Store listing deleted successfully");
  }

  async searchStores(req) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const city = searchParams.get("city") || "";

    const query = { isActive: true };
    if (q) {
      query.$or = [
        { storeName: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { area: { $regex: q, $options: "i" } },
      ];
    }
    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    const stores = await Store.find(query)
      .populate("vendorId", "businessName businessSlug logo coverImage")
      .populate("categoryIds", "name slug image")
      .lean();

    return ApiResponse.success(
      { stores, total: stores.length },
      "Stores searched successfully",
    );
  }
}

const storeController = new StoreController();
export default storeController;
