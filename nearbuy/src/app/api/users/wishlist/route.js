import dbConnect from "@/lib/db";
import Collection from "@/models/Collection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please sign in" },
        { status: 401 },
      );
    }

    const rawUserId = session.user.id || session.user._id || session.user.sub;
    if (!rawUserId || !mongoose.Types.ObjectId.isValid(rawUserId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID in session" },
        { status: 400 },
      );
    }

    const userId = new mongoose.Types.ObjectId(rawUserId);

    const body = await req.json();
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json(
        { success: false, message: "Item ID is required" },
        { status: 400 },
      );
    }

    const collection = await Collection.findById(itemId);
    if (!collection) {
      return NextResponse.json(
        { success: false, message: "Collection item not found" },
        { status: 404 },
      );
    }

    if (!Array.isArray(collection.likes)) {
      collection.likes = [];
    }

    // Check if user already liked this item using strict ObjectId comparison
    const hasLiked = collection.likes.some(
      (id) => id && id.toString() === userId.toString(),
    );

    let updatedCollection;

    if (hasLiked) {
      // Unlike: Remove user ID using $pull
      updatedCollection = await Collection.findByIdAndUpdate(
        itemId,
        { $pull: { likes: userId } },
        { new: true },
      );
    } else {
      // Like: Add user ID uniquely using $addToSet (Strict 1 user = 1 like max)
      updatedCollection = await Collection.findByIdAndUpdate(
        itemId,
        { $addToSet: { likes: userId } },
        { new: true },
      );
    }

    return NextResponse.json({
      success: true,
      isLiked: !hasLiked,
      likesCount: updatedCollection.likes.length,
      message: hasLiked ? "Like removed" : "Liked successfully",
    });
  } catch (err) {
    console.error("Wishlist API Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
