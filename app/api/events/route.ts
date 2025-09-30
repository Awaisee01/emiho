import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const upcoming = searchParams.get('upcoming') === 'true';
    let query: any = { isPrivate: false };
    if (upcoming) {
      query.date = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .populate('organizer', 'name image')
      .populate('attendees.user', 'name image')
      .sort({ date: 1 });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const body = await req.json();
    const { title, description, date, endDate, location, category, isPrivate, isPremium, maxAttendees } = body;

    const event = await Event.create({
      title,
      description,
      date: new Date(date),
      endDate: endDate ? new Date(endDate) : undefined,
      location,
      category,
      isPrivate: isPrivate || false,
      isPremium: isPremium || false,
      maxAttendees,
      organizer: session.user.id,
      attendees: []
    });

    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'name image');

    return NextResponse.json({ event: populatedEvent });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}