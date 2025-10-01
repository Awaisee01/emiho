import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { token, password } = await req.json();

    if (!token || !password) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: new Date() } });

    if (!user) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password only, skip other validations
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword, resetToken: null, resetTokenExpiry: null } },
      { runValidators: false }
    );

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("[Reset Password] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
