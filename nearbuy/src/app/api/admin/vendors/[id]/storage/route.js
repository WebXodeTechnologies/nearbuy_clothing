import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Vendor from "@/models/Vendor";

export async function PATCH(req, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    const { extraStorageGB } = await req.json();

    const bytesPerGB = 1024 * 1024 * 1024;
    const defaultBaseLimit = 2 * bytesPerGB; // 2GB default
    const newStorageLimitBytes =
      defaultBaseLimit + Number(extraStorageGB) * bytesPerGB;

    const updatedVendor = await Vendor.findByIdAndUpdate(
      id,
      {
        storageLimitBytes: newStorageLimitBytes,
        extraStorageGBAllocated: Number(extraStorageGB),
        storageRequestPending: false, // Clear request after allocation
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
