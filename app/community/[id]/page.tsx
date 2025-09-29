
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";

export default function CommunityDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [community, setCommunity] = useState<any>(null);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCommunity();
  }, [id]);

  const fetchCommunity = async () => {
    const res = await fetch(`/api/communities/${id}`);
    const data = await res.json();
    setCommunity(data);
    setTimeout(() => {
      feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  // Handle deep link: if user is logged in and not a member, prompt join; if not subscribed, route to pricing
  useEffect(() => {
    if (!community || !session?.user?.id) return;
    const isMember = community.members?.some((m: any) => (m?._id || m)?.toString() === session.user!.id);
    if (!isMember) {
      // fetch latest profile to read subscription
      (async () => {
        try {
          const res = await fetch('/api/user/profile', { cache: 'no-store' });
          const data = await res.json();
          const plan = data?.user?.subscription?.plan;
          const status = data?.user?.subscription?.status;
          const isPaid = plan && plan !== 'Free' && status === 'active';
          if (!isPaid) {
            toast.info('Subscription required to join this community');
            router.push('/pricing');
            return;
          }
          setShowJoinModal(true);
        } catch (_) {}
      })();
    }
  }, [community, session]);

  const handleJoinCommunity = async () => {
    try {
      const res = await fetch(`/api/communities/${id}/join`, { method: 'POST' });
      if (res.ok) {
        setShowJoinModal(false);
        await fetchCommunity();
      } else if (res.status === 403) {
        toast.info('Please upgrade your plan to join communities');
      } else if (res.status === 401) {
        toast.error('Please sign in first');
      }
    } catch (_) {}
  };

  const handlePost = async () => {
    if (!content && !image) return;

    setUploading(true);

    let imageUrl = "";
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        alert(uploadData.error || "Image upload failed");
        setUploading(false);
        return;
      }
      imageUrl = uploadData.url;
    }

    const postRes = await fetch(`/api/communities/${id}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, image: imageUrl }),
    });

    if (postRes.ok) {
      setContent("");
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowPostModal(false); // close modal
      setShowSuccessModal(true); // show success modal
      fetchCommunity();
    } else {
      const data = await postRes.json();
      alert(data.error || "Failed to post");
    }

    setUploading(false);
  };

  if (!community)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ...</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Community Header */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{community.name}</h1>
      <p className="text-gray-600 mb-6">{community.description}</p>

      {/* Open Post Modal Button */}
      {session && (
        <Button
          onClick={() => setShowPostModal(true)}
          className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md"
        >
          Create Post
        </Button>
      )}

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPostModal(false)}
            >
              <X size={20} />
            </button>
            <Textarea
              placeholder="Write something..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="resize-none rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full p-3 sm:text-base text-sm transition-all duration-200 placeholder-gray-400"
            />
            <label className="flex items-center mt-3 cursor-pointer w-full sm:w-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setImage(e.target.files[0])}
                className="hidden"
              />
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-gray-700 text-sm font-medium mt-2">
                <ImageIcon className="h-5 w-5 text-gray-500" />
                {image ? image.name : "Upload Image"}
              </div>
            </label>
            <Button
              onClick={handlePost}
              disabled={uploading}
              className="mt-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md"
            >
              {uploading ? "Uploading..." : "Post"}
            </Button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-lg">
            <h2 className="text-xl font-bold text-green-600 mb-2">Success!</h2>
            <p className="text-gray-700 mb-4">Your post was successfully submitted.</p>
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl"
            >
              Close
            </Button>
          </div>
        </div>
      )}

  {/* Join Modal */}
  {showJoinModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-lg">
        <h2 className="text-xl font-bold mb-2">Join Community</h2>
        <p className="text-gray-700 mb-4">Do you want to join {community.name}?</p>
        <div className="flex gap-2 justify-center">
          <Button onClick={() => setShowJoinModal(false)} variant="outline">Cancel</Button>
          <Button onClick={handleJoinCommunity} className="bg-blue-600 hover:bg-blue-700 text-white">Join</Button>
        </div>
      </div>
    </div>
  )}

      {/* Posts Feed */}
      <div className="space-y-4 max-h-[70vh] overflow-y-auto px-2 sm:px-0" ref={feedRef}>
        {community.posts?.map((post: any) => {
          const isMe = session?.user?.id === post.author._id;

          return (
            <div
              key={post._id}
              className={`flex items-start gap-3 flex-col sm:flex-row ${
                isMe ? "sm:justify-end" : "sm:justify-start"
              }`}
            >
              {!isMe && (
                <Image
                  src={post.author.image || "/default-avatar.png"}
                  alt={post.author.name}
                  width={50}
                  height={50}
                  className="rounded-full w-12 h-12 object-cover"
                />
              )}
              <div
                className={`max-w-full sm:max-w-[70%] p-3 rounded-xl break-words ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-900 rounded-bl-none"
                }`}
              >
                {!isMe && <p className="font-semibold text-sm mb-1 truncate sm:truncate-none">{post.author.name}</p>}
                <p className="whitespace-pre-wrap">{post.content}</p>
                {post.image && (
                  <div className="mt-2 w-full flex justify-center">
                    <Image
                      src={post.image}
                      alt="Post image"
                      width={400}
                      height={300}
                      className="rounded object-contain max-w-full h-auto"
                    />
                  </div>
                )}
              </div>
              {isMe && (
                <Image
                  src={post.author.image || "/default-avatar.png"}
                  alt={post.author.name}
                  width={50}
                  height={50}
                  className="rounded-full w-12 h-12 object-cover"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
