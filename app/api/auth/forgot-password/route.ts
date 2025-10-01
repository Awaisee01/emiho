import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await User.findOne({ email });

    // Respond success even if user not found (prevents email enumeration)
    if (!user) return NextResponse.json({ message: "If this email exists, reset link sent" });

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 15); // 15 min

    // Only update token fields, nothing else
    await User.updateOne(
      { _id: user._id },
      { $set: { resetToken: token, resetTokenExpiry: expiry } }
    );

    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link valid for 15 minutes.</p>`
    });

    return NextResponse.json({ message: "Password reset link sent" });
  } catch (error) {
    console.error("[Forgot Password] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
