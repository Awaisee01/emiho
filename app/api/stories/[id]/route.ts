import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Story from '@/models/Story';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const story = await Story.findById(params.id).populate('author', 'name image');
    if (!story) return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    return NextResponse.json({ story });
  } catch (error: any) {
    console.error('GET /api/stories/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


