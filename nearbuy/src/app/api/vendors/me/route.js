import { authenticate } from "@/middleware/auth.middleware";
import dbConnect from "@/lib/db";
import Vendor from "@/models/Vendor";
import User from "@/models/User";
import Store from "@/models/Store"; // Dual-sync support for Store model if present
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

// GET /api/vendors/me -> Get current vendor store profile
export const GET = withErrorHandler(async (req) => {
  const user = await getVendorUser(req);
  await dbConnect();

  const vendor = await Vendor.findOne({ ownerId: user.id }).populate(
    "ownerId",
    "name email image role",
  );

  // If no vendor profile exists (e.g. Admin user checking), return null instead of 404 error
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
    // Self-healing: If store exists, make sure User.vendorId is linked!
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

// PATCH /api/vendors/me -> Update active vendor store profile
export const PATCH = withErrorHandler(async (req) => {
  const user = await getVendorUser(req);
  await dbConnect();

  const body = await req.json();

  // 🔒 CRITICAL: Prevent vendors from modifying status field to prevent enum validation errors
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

  // 1. Update Vendor Collection
  const updatedVendor = await Vendor.findOneAndUpdate(
    { ownerId: user.id },
    { $set: body },
    { returnDocument: "after", new: true, runValidators: true },
  ).populate("ownerId", "name email image role");

  if (!updatedVendor) {
    throw new ApiError(404, "Vendor store profile not found to update.");
  }

  // 2. Dual-Sync: Update linked Store collection document if present
  try {
    if (Store) {
      await Store.findOneAndUpdate(
        { vendorId: updatedVendor._id },
        {
          $set: {
            storeName: updatedVendor.businessName || updatedVendor.storeName,
            description: updatedVendor.description || updatedVendor.tagline,
            tagline: updatedVendor.tagline || updatedVendor.description,
            address: updatedVendor.address,
            area: updatedVendor.area,
            city: updatedVendor.city,
            state: updatedVendor.state,
            pincode: updatedVendor.pincode,
            phone: updatedVendor.phone || updatedVendor.businessPhone,
            whatsapp: updatedVendor.whatsapp || updatedVendor.whatsappNumber,
            email: updatedVendor.email,
            website: updatedVendor.website,
            instagram: updatedVendor.instagram,
            facebook: updatedVendor.facebook,
            openingTime: updatedVendor.openingTime,
            closingTime: updatedVendor.closingTime,
            workingDays: updatedVendor.workingDays,
            facilities: updatedVendor.facilities,
            logo: updatedVendor.logo,
            coverImage: updatedVendor.coverImage,
            googleMapUrl: updatedVendor.googleMapUrl,
            isActive: updatedVendor.isActive,
          },
        },
        { returnDocument: "after", new: true },
      );
    }
  } catch (err) {
    console.warn(
      "Store collection sync skipped or model not active:",
      err.message,
    );
  }

  return ApiResponse.success(
    updatedVendor,
    "Store profile updated successfully",
  );
});
