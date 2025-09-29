// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Community from "@/models/Community";
// import Post from "@/models/Post";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function POST(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();

//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { content, image } = await req.json();

//     const post = await Post.create({
//       author: session.user.id,
//       community: params.id,
//       content,
//       image,
//     });

//     await Community.findByIdAndUpdate(params.id, {
//       $push: { posts: post._id },
//     });

//     return NextResponse.json(post, { status: 201 });
//   } catch (error: any) {
//     console.error("❌ POST /api/communities/[id]/posts error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error", details: error.message },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Community from "@/models/Community";
import Post from "@/models/Post";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse JSON (we already uploaded image separately)
    const { content, image } = await req.json();

    const post = await Post.create({
      author: session.user.id,
      community: params.id,
      content,
      image: image || "",
    });

    await Community.findByIdAndUpdate(params.id, { $push: { posts: post._id } });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error("❌ POST /api/communities/[id]/posts error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
