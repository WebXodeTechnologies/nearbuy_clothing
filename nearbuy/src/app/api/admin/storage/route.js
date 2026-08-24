import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Vendor from "@/models/Vendor";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ApiError from "@/utils/apiError";

export async function GET(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (
      !session ||
      !session.user ||
      session.user.role?.toUpperCase() !== "ADMIN"
    ) {
      return NextResponse.json(
        { success: false, message: "Unauthorized Admin access" },
        { status: 403 },
      );
    }

    // Fetch all vendors from MongoDB
    const vendors = await Vendor.find({}).lean();

    const formattedVendors = vendors.map((v) => ({
      _id: v._id,
      storeName: v.businessName || v.storeName || "Unnamed Store",
      businessName: v.businessName,
      storageUsedBytes: v.storageUsedBytes || 0,
      storageLimitBytes:
        (2 + (v.extraStorageGBAllocated || 0)) * 1024 * 1024 * 1024,
      extraStorageGBAllocated: v.extraStorageGBAllocated || 0,
    }));

    return NextResponse.json({ success: true, data: formattedVendors });
  } catch (err) {
    console.error("Admin Storage Fetch Error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
