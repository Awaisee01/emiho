import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Community from '@/models/Community';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');

    let query: any = { isPrivate: false };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }

    const communities = await Community.find(query)
      .populate('creator', 'name image')
      .populate('members', 'name image')
      .sort({ createdAt: -1 });

    return NextResponse.json({ communities });
  } catch (error) {
    console.error('Get communities error:', error);
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
    const { name, description, category, isPrivate, isPremium } = body;

    const community = await Community.create({
      name,
      description,
      category,
      isPrivate: isPrivate || false,
      isPremium: isPremium || false,
      creator: session.user.id,
      members: [session.user.id]
    });

    const populatedCommunity = await Community.findById(community._id)
      .populate('creator', 'name image')
      .populate('members', 'name image');

    return NextResponse.json({ community: populatedCommunity });
  } catch (error) {
    console.error('Create community error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}