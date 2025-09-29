import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Community from "@/models/Community";
import Post from "@/models/Post"; // 👈 ADD THIS LINE

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const community = await Community.findById(params.id)
      .populate("members", "name email image")
      .populate({
        path: "posts",
        model: Post, // 👈 explicitly tell mongoose which model to use
        populate: { path: "author", select: "name email image" },
      });

    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    return NextResponse.json(community);
  } catch (error: any) {
    console.error("❌ GET /api/communities/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
