import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Story from '@/models/Story';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const story = await Story.findById(params.id);
    if (!story) return NextResponse.json({ error: 'Story not found' }, { status: 404 });

    const { content } = await req.json();
    if (!content || content.trim() === '') return NextResponse.json({ error: 'Empty comment' }, { status: 400 });

    const comment = {
      userId: session.user.id,
      content,
      createdAt: new Date(),
    };

    story.comments.push(comment);
    await story.save();

    return NextResponse.json({ comment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
