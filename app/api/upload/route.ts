import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  let formData;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      formData = await req.formData();
    } catch (parseError) {
      return NextResponse.json({ error: 'Failed to parse form data' }, { status: 400 });
    }

    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    let bytes, buffer;
    try {
      bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    } catch (bufferError) {
      return NextResponse.json({ error: 'Failed to process file' }, { status: 400 });
    }

    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary with better error handling
    let result;
    try {
      result = await uploadToCloudinary(base64, 'emiho');
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return NextResponse.json({
        error: 'Failed to upload image. Please try again.'
      }, { status: 500 });
    }

    if (!result || !result.url) {
      return NextResponse.json({
        error: 'Upload completed but no URL returned'
      }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId || null
    });

    return response;

  } catch (error: unknown) {
    console.error('Upload error:', error);

    if (error instanceof Error) {
      if (error.name === 'PayloadTooLargeError') {
        return NextResponse.json(
          { error: 'File too large' },
          { status: 413 }
        );
      }

      // Optional: return the actual message for other error types
      return NextResponse.json(
        { error: error.message || 'Upload failed - please try again' },
        { status: 500 }
      );
    } else {
      // In case it's not an Error instance (rare)
      return NextResponse.json(
        { error: 'Unknown upload error' },
        { status: 500 }
      );
    }
  }

}