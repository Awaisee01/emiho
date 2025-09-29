

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Story from '@/models/Story';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const story = await Story.findById(params.id);
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    const userId = session.user.id;
    const isLiked = story.likes.includes(userId);

    if (isLiked) {
      story.likes = story.likes.filter((id: string) => id.toString() !== userId);
    } else {
      story.likes.push(userId);
    }

    await story.save();

    return NextResponse.json({ liked: !isLiked, likesCount: story.likes.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
