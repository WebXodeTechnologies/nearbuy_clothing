import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Vendor from "@/models/Vendor";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(req, context) {
  await dbConnect();
  try {
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

    const params = await context.params;
    const { id } = params;
    const { extraStorageGB } = await req.json();

    const bytesPerGB = 1024 * 1024 * 1024;
    const defaultBaseLimit = 1 * bytesPerGB;
    const newStorageLimitBytes =
      defaultBaseLimit + Number(extraStorageGB) * bytesPerGB;

    const updatedVendor = await Vendor.findByIdAndUpdate(
      id,
      {
        storageLimitBytes: newStorageLimitBytes,
        extraStorageGBAllocated: Number(extraStorageGB),
        storageRequestPending: false,
        requestedStorageGB: 0,
      },
      { new: true },
    );

    if (!updatedVendor) {
      return NextResponse.json(
        { success: false, message: "Vendor not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully allocated ${extraStorageGB}GB storage!`,
      data: updatedVendor,
    });
  } catch (err) {
    console.error("Storage Allocation Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
