import { authenticate } from "@/middleware/auth.middleware";
import dbConnect from "@/lib/db";
import Vendor from "@/models/Vendor";
import User from "@/models/User";
import Store from "@/models/Store";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";
import { withErrorHandler } from "@/middleware/error.middleware";

// Helper function to verify Vendor role
async function getVendorUser(req) {
  const user = await authenticate(req);
  const role = (user?.role || "").toUpperCase();
  if (role !== "VENDOR" && role !== "ADMIN") {
    throw new ApiError(403, "Access denied: Merchant Vendor role required.");
  }
  return user;
}

// GET /api/vendors/me -> Get current vendor store profile securely
export const GET = withErrorHandler(async (req) => {
  const user = await getVendorUser(req);
  await dbConnect();

  // Confidentiality Check: Strictly scope to logged-in user's ID
  const vendor = await Vendor.findOne({ ownerId: user.id }).populate(
    "ownerId",
    "name email image role",
  );

  if (!vendor) {
    return ApiResponse.success(
      null,
      "No vendor store profile associated with this account.",
    );
  }

  return ApiResponse.success(vendor, "Vendor profile retrieved successfully");
});

// POST /api/vendors/me -> Setup initial vendor store & link user.vendorId
export const POST = withErrorHandler(async (req) => {
  const user = await getVendorUser(req);
  await dbConnect();

  const body = await req.json();
  const { storeName, businessName, businessPhone, category, address, bio } =
    body;

  const finalBusinessName = businessName || storeName || "Latest Trends";

  // 1. Check if store already exists for this owner
  let existingVendor = await Vendor.findOne({ ownerId: user.id });
  if (existingVendor) {
    await User.findByIdAndUpdate(user.id, {
      vendorId: existingVendor._id,
      profileCompleted: true,
    });

    return ApiResponse.success(
      existingVendor,
      "Existing store linked to vendor account successfully",
    );
  }

  const slug =
    finalBusinessName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-") +
    "-" +
    Date.now().toString().slice(-4);

  // 2. Create Vendor document
  const newVendor = await Vendor.create({
    ownerId: user.id,
    businessName: finalBusinessName,
    storeName: finalBusinessName,
    businessPhone: businessPhone || "",
    category: category || "Apparel",
    address: address || "",
    bio: bio || "",
    slug: slug,
    businessSlug: slug,
  });

  // 3. Link vendorId & set profileCompleted on User document
  await User.findByIdAndUpdate(user.id, {
    vendorId: newVendor._id,
    profileCompleted: true,
  });

  return ApiResponse.created(
    newVendor,
    "Store created and linked successfully",
  );
});

// PATCH /api/vendors/me -> Update active vendor store profile securely
export const PATCH = withErrorHandler(async (req) => {
  const user = await getVendorUser(req);
  await dbConnect();

  const body = await req.json();

  // Prevent vendors from modifying status field directly
  delete body.status;

  // Sync alias key names across schemas
  if (body.storeName) body.businessName = body.storeName;
  if (body.businessName) body.storeName = body.businessName;
  if (body.phone) body.businessPhone = body.phone;
  if (body.whatsapp) body.whatsappNumber = body.whatsapp;
  if (body.description) {
    body.tagline = body.description;
    body.bio = body.description;
  }

  // 🛡️ CRITICAL FIX: Check if existing vendor already has a slug/businessSlug,
  // or generate a safe unique one to prevent `null` duplicate key errors.
  const existingVendorRecord = await Vendor.findOne({ ownerId: user.id });

  const targetName =
    body.businessName ||
    body.storeName ||
    existingVendorRecord?.businessName ||
    "store";
  const fallbackSlug =
    targetName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-") +
    "-" +
    Date.now().toString().slice(-4);

  if (!body.businessSlug && !existingVendorRecord?.businessSlug) {
    body.businessSlug = fallbackSlug;
  }
  if (!body.slug && !existingVendorRecord?.slug) {
    body.slug = fallbackSlug;
  }

  // 1. Update or Auto-Create Vendor Collection scoped to user.id
  const updatedVendor = await Vendor.findOneAndUpdate(
    { ownerId: user.id },
    { $set: { ...body, ownerId: user.id } },
    { upsert: true, returnDocument: "after", runValidators: true },
  ).populate("ownerId", "name email image role");

  // 2. Ensure User document links to vendorId
  await User.findByIdAndUpdate(user.id, {
    vendorId: updatedVendor._id,
    profileCompleted: true,
  });

  // 3. Dual-Sync: Update or Auto-Create linked Store document securely
  try {
    if (Store) {
      const existingStore = await Store.findOne({
        vendorId: updatedVendor._id,
      });

      const storeSlug =
        existingStore?.storeSlug ||
        updatedVendor.businessSlug ||
        updatedVendor.slug ||
        fallbackSlug;

      await Store.findOneAndUpdate(
        { vendorId: updatedVendor._id },
        {
          $set: {
            vendorId: updatedVendor._id,
            storeName: updatedVendor.businessName || updatedVendor.storeName,
            storeSlug: storeSlug,
            description: updatedVendor.description || updatedVendor.bio || "",
            tagline: updatedVendor.tagline || "",
            address: updatedVendor.address || "",
            city: updatedVendor.city || "Namakkal",
            phone: updatedVendor.businessPhone || updatedVendor.phone || "",
            whatsapp:
              updatedVendor.whatsappNumber || updatedVendor.whatsapp || "",
            email: updatedVendor.email || user.email || "",
            website: updatedVendor.website || "",
            logo: updatedVendor.logo || "",
            coverImage: updatedVendor.coverImage || "",
            isActive: true,
          },
        },
        { upsert: true, returnDocument: "after" },
      );
    }
  } catch (err) {
    console.warn("Store collection sync error:", err.message);
  }

  return ApiResponse.success(
    updatedVendor,
    "Store profile updated and published successfully",
  );
});
