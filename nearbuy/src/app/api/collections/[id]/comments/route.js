import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Collection from "@/models/Collection";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // 👇 Await params to unwrap the dynamic route segment
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    const { text } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, message: "Comment text is required" },
        { status: 400 },
      );
    }

    const collection = await Collection.findById(id);
    if (!collection) {
      return NextResponse.json(
        { success: false, message: "Collection not found" },
        { status: 404 },
      );
    }

    if (!collection.comments) {
      collection.comments = [];
    }

    const newComment = {
      userId: session.user.id || session.user._id,
      userName: session.user.name || "Shopper",
      text: text.trim(),
      createdAt: new Date(),
    };

    collection.comments.push(newComment);
    await collection.save();

    return NextResponse.json({
      success: true,
      message: "Comment posted successfully",
      comment: newComment,
    });
  } catch (err) {
    console.error("Comment Post Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
