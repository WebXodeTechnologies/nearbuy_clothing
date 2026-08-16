import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Vendor from "@/models/Vendor";
import User from "@/models/User";

export async function POST(req) {
  await dbConnect();
  try {
    const { userEmail, requestedGB } = await req.json();

    if (!userEmail || !requestedGB) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const vendor = await Vendor.findOne({ ownerId: user._id });
    if (!vendor) {
      return NextResponse.json(
        { success: false, message: "Vendor profile not found" },
        { status: 404 },
      );
    }

    // Update vendor with pending storage request
    vendor.storageRequestPending = true;
    vendor.requestedStorageGB = Number(requestedGB);
    vendor.storageRequestDate = new Date();
    await vendor.save();

    return NextResponse.json({
      success: true,
      message:
        "Storage upgrade request sent to admin successfully! Please complete your payment offline to activate.",
    });
  } catch (err) {
    console.error("Storage Request Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
