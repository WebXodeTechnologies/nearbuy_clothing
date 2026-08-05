import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import Store from "@/models/Store";
import Category from "@/models/Category";
import Offer from "@/models/Offer";
import Collection from "@/models/Collection";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");

    const storeQuery = { isActive: true };
    if (city && city !== "All Locations") {
      storeQuery.city = { $regex: new RegExp(`^${city}$`, "i") };
    }

    // Run parallel database queries using .lean() for high performance execution
    const [stores, categories, offers, collections] = await Promise.all([
      Store.find(storeQuery)
        .populate("vendorId", "businessName businessSlug logo phone coverImage")
        .lean(),
      Category.find({ isActive: true }).sort({ displayOrder: 1 }).lean(),
      Offer.find({ status: "Active" }).sort({ createdAt: -1 }).limit(10).lean(),
      Collection.find({}).sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stores,
        categories,
        offers,
        collections,
      },
    });
  } catch (error) {
    console.error("Public Directory API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
