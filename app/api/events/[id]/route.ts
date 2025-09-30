import { NextResponse } from "next/server";
import Event from "@/models/Event"; // assuming you have a mongoose model
import connectDB from '@/lib/mongodb';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const event = await Event.findById(params.id)
      .populate("organizer", "name image") // optional: populate organizer details
      .populate("attendees", "name image"); // optional: populate attendees

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}
