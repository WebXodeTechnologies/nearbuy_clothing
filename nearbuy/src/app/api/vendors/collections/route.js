import { authenticate } from "@/middleware/auth.middleware";
import dbConnect from "@/lib/db";
import Vendor from "@/models/Vendor";
import Store from "@/models/Store";
import Collection from "@/models/Collection";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";
import { withErrorHandler } from "@/middleware/error.middleware";

// GET -> Fetch collections (Publicly by vendorId/storeId, or securely for logged-in vendor)
export const GET = withErrorHandler(async (req) => {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const queryVendorId = searchParams.get("vendorId");
  const queryStoreId = searchParams.get("storeId");

  let collections = [];

  // If public query parameters are passed from the storefront page:
  if (queryVendorId || queryStoreId) {
    const conditions = [];
    if (queryVendorId) conditions.push({ vendorId: queryVendorId });
    if (queryStoreId) conditions.push({ storeId: queryStoreId });

    collections = await Collection.find({ $or: conditions });
  } else {
    // Otherwise, require authentication for the vendor dashboard
    const user = await authenticate(req);
    const role = (user?.role || "").toUpperCase();
    if (!user || (role !== "VENDOR" && role !== "ADMIN")) {
      throw new ApiError(403, "Access denied: Vendor role required.");
    }

    const vendor = await Vendor.findOne({ ownerId: user.id });
    if (!vendor) {
      throw new ApiError(404, "Vendor profile not found.");
    }

    // Fetch dashboard items for this vendor
    collections = await Collection.find({
      $or: [{ vendorId: vendor._id }, { storeId: vendor._id }],
    });
  }

  return ApiResponse.success(
    { collections },
    "Collections retrieved successfully",
  );
});

// POST -> Create a collection tied strictly to this vendor & store
export const POST = withErrorHandler(async (req) => {
  const user = await authenticate(req);
  const role = (user?.role || "").toUpperCase();
  if (!user || (role !== "VENDOR" && role !== "ADMIN")) {
    throw new ApiError(403, "Access denied: Vendor role required.");
  }

  await dbConnect();
  const body = await req.json();

  const vendor = await Vendor.findOne({ ownerId: user.id });
  if (!vendor) {
    throw new ApiError(404, "Vendor profile not found.");
  }

  const store = await Store.findOne({ vendorId: vendor._id });

  const newCollection = await Collection.create({
    ...body,
    vendorId: vendor._id,
    storeId: store?._id || body.storeId || null,
  });

  return ApiResponse.created(newCollection, "Collection created successfully");
});
