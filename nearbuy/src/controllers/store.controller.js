import { validate } from "@/middleware/validate.middleware";
import { storeSchema, updateStoreSchema } from "@/validations/store.schema";
import storeService from "@/services/store.service";
import Store from "@/models/Store";
import Category from "@/models/Category";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

class StoreController {
  async createStore(req) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const body = await req.json();
    console.log("📥 [Store API] Incoming Create Store Body:", body);
    const validatedData = validate(storeSchema, body);

    const store = await storeService.createStore(
      session.user.id || session.user.vendorId,
      validatedData,
    );
    console.log("✅ [Store API] Store Created Successfully:", store._id);
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

    console.log(
      "🔍 [Store API] Fetching stores with params - vendor:",
      vendor,
      "all:",
      all,
      "city:",
      city,
    );

    let query = {};
    if (vendor) {
      query.vendorId = vendor;
    } else if (!all && city) {
      query.city = { $regex: new RegExp(city, "i") };
    }

    const rawStores = await Store.find(query)
      .populate("vendorId")
      .populate("categoryIds")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Store.countDocuments(query);

    rawStores.forEach((s, idx) => {
      console.log(
        `📦 [Store API DB Result] Store [${idx}] (${s.storeName || s.name}):`,
        {
          id: s._id,
          categoryIds: s.categoryIds,
        },
      );
    });

    return ApiResponse.success(
      { stores: rawStores, total, page, limit },
      "Stores retrieved successfully",
    );
  }

  async getStoreById(req, context) {
    await dbConnect();

    const resolvedParams = await context?.params;
    const identifier = resolvedParams?.slug || resolvedParams?.id;

    const store = await Store.findOne({
      $or: [
        { storeSlug: identifier },
        { businessSlug: identifier },
        { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : null },
      ],
    })
      .populate("vendorId")
      .populate("categoryIds");

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
    console.log("📥 [Store API] Updating Store ID:", id, "with body:", body);
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

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const resolvedParams = params instanceof Promise ? await params : params;
    const { id } = resolvedParams;

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
