import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Vendor from "@/models/Vendor";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

    const formattedVendors = vendors.map((v) => {
      const extraGB = v.extraStorageGBAllocated || 0;
      // Strictly enforce 1GB baseline + extra allocated GB
      const calculatedLimitBytes = (1 + extraGB) * 1024 * 1024 * 1024;

      return {
        _id: v._id,
        storeName: v.businessName || v.storeName || "Unnamed Store",
        businessName: v.businessName,
        storageUsedBytes: v.storageUsedBytes || 0,
        storageLimitBytes: calculatedLimitBytes,
        extraStorageGBAllocated: extraGB,
      };
    });

    return NextResponse.json({ success: true, data: formattedVendors });
  } catch (err) {
    console.error("Admin Storage Fetch Error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
