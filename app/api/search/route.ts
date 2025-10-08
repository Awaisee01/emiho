import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Story from "@/models/Story";
import Event from "@/models/Event";
import Community from "@/models/Community";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (!q) {
      return NextResponse.json({ stories: [], events: [], communities: [] });
    }

    // Build regex for case-insensitive partial search
    const regex = new RegExp(q, "i");

    // Run queries in parallel for speed
    const [stories, events, communities] = await Promise.all([
      Story.find({
        $or: [{ title: regex }, { content: regex }, { tags: regex }]
      })
        .limit(5)
        .select("title category _id createdAt")
        .lean(),

      Event.find({
        $or: [{ title: regex }, { description: regex }, { category: regex }]
      })
        .limit(5)
        .select("title category date _id")
        .lean(),

      Community.find({
        $or: [{ name: regex }, { description: regex }, { category: regex }]
      })
        .limit(5)
        .select("name category _id")
        .lean(),
    ]);

    return NextResponse.json({
      stories,
      events,
      communities,
    });
  } catch (error) {
    console.error("❌ Search API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
