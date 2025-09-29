import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Story from '@/models/Story';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let query: any = { isPrivate: false };
    if (category && category !== 'all') {
      query.category = category;
    }

    const stories = await Story.find(query)
      .populate('author', 'name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ stories });
  } catch (error) {
    console.error('Get stories error:', error);
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
    const { title, content, category, media, isPremium, tags } = body;

    const story = await Story.create({
      title,
      content,
      category,
      media: media || [],
      isPremium: isPremium || false,
      tags: tags || [],
      author: session.user.id
    });

    const populatedStory = await Story.findById(story._id).populate('author', 'name image');

    return NextResponse.json({ story: populatedStory });
  } catch (error) {
    console.error('Create story error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}