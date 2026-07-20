import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await request.json();
    if (!role || !["customer", "vendor", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    await dbConnect();
    
    // Find the logged-in Google user and update their role
    const user = await User.findOne({ email: session.user.email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update role
    user.role = role;
    await user.save();

    return NextResponse.json({ 
      message: "Role updated successfully", 
      role: user.role 
    });
  } catch (error) {
    console.error("Update Role Error:", error);
    return NextResponse.json(
      { error: "Server error occurred while updating profile" },
      { status: 500 }
    );
  }
}
