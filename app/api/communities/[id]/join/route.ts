import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Community from "@/models/Community";
import User from "@/models/User";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate ObjectId
    if (!params.id || params.id.length < 12) {
      return NextResponse.json({ error: "Invalid community id" }, { status: 400 });
    }

    // Restrict join to paying users only
    const isPaid = user.subscription?.plan && user.subscription.plan !== "Free" && user.subscription.status === "active";
    if (!isPaid) {
      return NextResponse.json({ error: "Upgrade required to join communities" }, { status: 403 });
    }

    const community = await Community.findById(params.id);
    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    if (!community.members.includes(user._id)) {
      community.members.push(user._id);
      await community.save();
    }

    return NextResponse.json({ success: true, community });
  } catch (err: any) {
    console.error('Join community error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
