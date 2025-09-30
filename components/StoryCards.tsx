"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Share2,
  MessageCircle,
  Crown,
  Eye,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";

interface Comment {
  userId: string;
  content: string;
  createdAt: string;
}

interface StoryCardProps {
  story: {
    _id: string;
    title: string;
    content: string;
    currentUserName: string; // <-- add this

    author: {
      name: string;
      image?: string;
      location?: string;
    };
    category: string;
    media: Array<{
      type: "image" | "video" | "audio";
      url: string;
    }>;
    likes: string[];
    shares: string[];
    comments: Comment[];
    isPremium: boolean;
    createdAt: string;
    views?: number;
    tags?: string[];
  };
  currentUserId?: string;
  onStoryUpdate?: () => void;
  onLike?: () => Promise<void>; // <-- add this line
  index?: number;
}

export default function StoryCard({
  story,
  currentUserId,
  onStoryUpdate,
  index = 0,
}: StoryCardProps) {
  const [isLiked, setIsLiked] = useState(
    currentUserId ? story.likes.includes(currentUserId) : false
  );
  const [likesCount, setLikesCount] = useState(story.likes.length);
  const [sharesCount, setSharesCount] = useState(story.shares.length);
  const [comments, setComments] = useState(story.comments || []);
  const [comment, setComment] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine if content should be truncated (more than 150 characters)
  const shouldTruncate = story.content.length > 150;
  const truncatedContent = shouldTruncate
    ? story.content.substring(0, 150) + "..."
    : story.content;

  // Like handler
  const handleLike = async () => {
    if (!currentUserId) return alert("Login to like!");
    try {
      const res = await fetch(`/api/stories/${story._id}/like`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setIsLiked(data.liked);
        setLikesCount(data.likesCount);
        onStoryUpdate?.();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Comment handler
  const handleComment = async () => {
    if (!currentUserId) return alert("Login to comment!");
    if (!comment.trim()) return;

    try {
      const res = await fetch(`/api/stories/${story._id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setComments([...comments, data.comment]);
        setComment("");
        setCommenting(false);
        onStoryUpdate?.();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Story Image/Media */}
      <div className="relative overflow-hidden">
        {story.media.length > 0 && story.media[0].type === "image" ? (
          <img
            src={story.media[0].url}
            alt={story.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : story.media.length > 0 && story.media[0].type === "video" ? (
          <video
            src={story.media[0].url}
            className="w-full h-64 object-cover"
            controls
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-blue-400 mx-auto mb-2" />
              <p className="text-blue-600 font-medium">Story</p>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
            {story.category}
            {story.isPremium && (
              <Crown className="h-3 w-3 ml-1 text-yellow-300" />
            )}
          </span>
        </div>

        {/* Options Button */}
        <div className="absolute top-4 right-4">
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
            <MoreHorizontal className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Story Content */}
      <div className="p-6">
        {/* Author Info */}
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={story.author?.image || "/default-avatar.png"} />
            <AvatarFallback>{story.author?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900">{story.author?.name || "Unknown"}</p>
            <p className="text-sm text-gray-600">
              {story.author?.location ||
                formatDistanceToNow(new Date(story.createdAt), {
                  addSuffix: true,
                })}
            </p>
          </div>
        </div>

        {/* Story Title and Content */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {story.title}
        </h3>

        <div className="text-gray-600 mb-4">
          <p className="leading-relaxed">
            {isExpanded ? story.content : truncatedContent}
          </p>

          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center space-x-1 mt-3 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <span>{isExpanded ? "Read less" : "Read more"}</span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {story.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium hover:bg-blue-100 hover:text-blue-600 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center space-x-6 mb-4 text-sm text-gray-500">
          {story.views && (
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{story.views.toLocaleString()}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Heart className="h-4 w-4" />
            <span>{likesCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{comments.length}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Share2 className="h-4 w-4" />
            <span>{sharesCount}</span>
          </div>
        </div>

        {/* Comment input */}
        {commenting && currentUserId && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleComment}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Post Comment
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCommenting(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Comments list */}
        {comments.length > 0 && (
          <div className="mb-4 space-y-3">
            <h4 className="font-medium text-gray-900">Comments</h4>
            {comments.slice(0, 3).map((c, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700"
              >
                {c.content}
              </div>
            ))}
            {comments.length > 3 && (
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                View all {comments.length} comments
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isLiked
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span>Like</span>
            <span className="bg-white px-2 py-1 rounded-full text-xs">
              {likesCount}
            </span>
          </button>

          <button
            onClick={() => setCommenting(!commenting)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Comment</span>
            <span className="bg-white px-2 py-1 rounded-full text-xs">
              {comments.length}
            </span>
          </button>

          <button
            onClick={async () => {
              try {
                const url = `${window.location.origin}/stories/${story._id}`;
                await navigator.clipboard.writeText(url);
                setSharesCount((c) => c + 1);
                toast.success("Link copied to clipboard");
              } catch (_) {
                toast.error("Failed to copy link");
              }
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
            <span className="bg-white px-2 py-1 rounded-full text-xs">{sharesCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
