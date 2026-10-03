import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth.config";
import dbConnect from "@/lib/db";
import Gallery from "@/models/Gallery";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in." },
        { status: 401 },
      );
    }

    const { id } = await params;
    const userId = session.user.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Gallery Asset ID is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const asset = await Gallery.findById(id);
    if (!asset) {
      return NextResponse.json(
        { success: false, message: "Gallery item not found" },
        { status: 404 },
      );
    }

    if (!Array.isArray(asset.likes)) {
      asset.likes = [];
    }

    const userObjectIdStr = userId.toString();
    const existingIndex = asset.likes.findIndex(
      (likeId) => likeId.toString() === userObjectIdStr,
    );

    let isLiked = false;
    if (existingIndex > -1) {
      asset.likes.splice(existingIndex, 1);
      isLiked = false;
    } else {
      asset.likes.push(userId);
      isLiked = true;
    }

    await asset.save();

    return NextResponse.json({
      success: true,
      isLiked,
      likesCount: asset.likes.length,
      message: isLiked ? "Added to liked gallery" : "Removed like",
    });
  } catch (error) {
    console.error("Gallery like error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update like status",
      },
      { status: 500 },
    );
  }
}
