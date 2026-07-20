import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth.config";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const rawRole = body.role;
    if (!rawRole) {
      return NextResponse.json({ error: "Role parameter is required" }, { status: 400 });
    }

    let normalizedRole = String(rawRole).toUpperCase().trim();
    if (normalizedRole === "CUSTOMER") normalizedRole = "USER";

    if (!["USER", "VENDOR", "ADMIN"].includes(normalizedRole)) {
      return NextResponse.json({ error: `Invalid role: ${rawRole}` }, { status: 400 });
    }

    await dbConnect();

    const email = session.user.email.toLowerCase().trim();
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: session.user.name || email.split("@")[0],
        email: email,
        image: session.user.image || "",
        role: normalizedRole,
      });
    } else {
      user.role = normalizedRole;
      await user.save();
    }

    return NextResponse.json({
      message: "Role updated successfully",
      role: user.role,
    });
  } catch (error) {
    console.error("Update Role Error:", error);
    return NextResponse.json(
      { error: error.message || "Server error occurred while updating profile" },
      { status: 500 }
    );
  }
}
