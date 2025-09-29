import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  let body;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body with error handling
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    await connectDB();

    const { name, bio, location, website, image } = body;

    // Build update object more carefully
    const updateData: any = {};

    // Direct user fields
    if (name !== undefined && name.trim()) {
      updateData.name = name.trim();
    }
    if (image !== undefined) {
      updateData.image = image;
    }

    // Profile fields - handle nested updates properly
    if (bio !== undefined || location !== undefined || website !== undefined) {
      // Get current user to preserve existing profile data
      const currentUser = await User.findById(session.user.id);
      if (!currentUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const currentProfile = currentUser.profile || {};

      updateData.profile = {
        bio: bio !== undefined ? bio.trim() : currentProfile.bio || '',
        location: location !== undefined ? location.trim() : currentProfile.location || '',
        website: website !== undefined ? website.trim() : currentProfile.website || ''
      };
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        profile: user.profile || {},
        subscription: user.subscription || {}
      }
    });

    return response;

  } catch (error: unknown) {
    console.error('Update profile error:', error);

    if (error instanceof Error) {
      // Now TypeScript knows error has 'name' and 'message'
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          {
            error: 'Validation error',
            details: error.message,
          },
          { status: 400 }
        );
      }

      if (error.name === 'CastError') {
        return NextResponse.json(
          {
            error: 'Invalid user ID format',
          },
          { status: 400 }
        );
      }

      // Fallback for other Error types
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    } else {
      // If error is not an instance of Error
      return NextResponse.json(
        {
          error: 'An unknown error occurred',
        },
        { status: 500 }
      );
    }
  }

}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        profile: user.profile || {},
        subscription: user.subscription || {}
      }
    });

    return response;

  }
  catch (error: unknown) {
    console.error('Get profile error:', error);

    if (error instanceof Error) {
      // Now you can safely access error.name
      if (error.name === 'CastError') {
        return NextResponse.json(
          { error: 'Invalid user ID format' },
          { status: 400 }
        );
      }

      // Optional: return the actual message for other error types
      return NextResponse.json(
        { error: error.message || 'Internal server error' },
        { status: 500 }
      );
    } else {
      // If the error is not an instance of Error (rare)
      return NextResponse.json(
        { error: 'Unknown error occurred' },
        { status: 500 }
      );
    }
  }

}

