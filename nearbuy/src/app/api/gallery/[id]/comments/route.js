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
    const body = await req.json();
    const { text } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, message: "Comment text cannot be empty" },
        { status: 400 },
      );
    }

    await dbConnect();

    const asset = await Gallery.findById(id);
    if (!asset) {
      return NextResponse.json(
        { success: false, message: "Gallery asset not found" },
        { status: 404 },
      );
    }

    const newComment = {
      userId: session.user.id,
      userName: session.user.name || "Shopper",
      text: text.trim(),
      createdAt: new Date(),
    };

    if (!Array.isArray(asset.comments)) {
      asset.comments = [];
    }

    asset.comments.push(newComment);
    await asset.save();

    return NextResponse.json({
      success: true,
      comment: newComment,
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error("Gallery comment error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add comment" },
      { status: 500 },
    );
  }
}
