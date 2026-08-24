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
import { getServerSession } from "next-auth"; // 👈 Required import
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // 👈 Adjust path if needed

class StoreController {
  async createStore(req) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const body = await req.json();
    const validatedData = validate(storeSchema, body);

    const store = await storeService.createStore(
      session.user.id || session.user.vendorId,
      validatedData,
    );
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

  async getStoreById(req, context) {
    await dbConnect();

    // Next.js App Router context parameters can be a promise or direct object
    const resolvedParams = await context?.params;
    const identifier = resolvedParams?.slug || resolvedParams?.id;

    // Query by storeSlug, businessSlug, or _id, and POPULATE vendorId
    const store = await Store.findOne({
      $or: [
        { storeSlug: identifier },
        { businessSlug: identifier },
        { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : null },
      ],
    }).populate("vendorId"); // 🔒 Crucial: Populates vendorId so vendorId._id is available!

    if (!store) {
      throw new ApiError(404, "Store profile not found.");
    }

    return ApiResponse.success(store, "Store retrieved successfully");
  }

  async updateStore(req, { params }) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    const body = await req.json();
    const validatedData = validate(updateStoreSchema, body);

    const updatedStore = await storeService.updateStore(
      id,
      session.user.id || session.user.vendorId,
      validatedData,
    );

    return ApiResponse.success(
      updatedStore,
      "Store listing updated successfully",
    );
  }

  async deleteStore(req, { params }) {
    await dbConnect();

    // Authenticate session to check roles and support Admin override
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

    // Pass user ID and role so the service layer can allow ADMIN overrides
    await storeService.deleteStore(
      id,
      session.user.id || session.user.vendorId,
      session.user.role,
    );

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
