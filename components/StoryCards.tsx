// "use client";

// import { useState } from "react";
// import { formatDistanceToNow } from "date-fns";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   Heart,
//   Share2,
//   MessageCircle,
//   Crown,
//   Eye,
//   ThumbsUp,
//   ChevronDown,
//   ChevronUp,
//   MoreHorizontal,
// } from "lucide-react";
// import { toast } from "sonner";

// interface Comment {
//   userId: string;
//   content: string;
//   createdAt: string;
// }

// interface StoryCardProps {
//   story: {
//     _id: string;
//     title: string;
//     content: string;
//     currentUserName: string; // <-- add this

//     author: {
//       name: string;
//       image?: string;
//       location?: string;
//     };
//     category: string;
//     media: Array<{
//       type: "image" | "video" | "audio";
//       url: string;
//     }>;
//     likes: string[];
//     shares: string[];
//     comments: Comment[];
//     isPremium: boolean;
//     createdAt: string;
//     views?: number;
//     tags?: string[];
//   };
//   currentUserId?: string;
//   onStoryUpdate?: () => void;
//   onLike?: () => Promise<void>; // <-- add this line
//   index?: number;
// }

// export default function StoryCard({
//   story,
//   currentUserId,
//   onStoryUpdate,
//   index = 0,
// }: StoryCardProps) {
//   const [isLiked, setIsLiked] = useState(
//     currentUserId ? story.likes.includes(currentUserId) : false
//   );
//   const [likesCount, setLikesCount] = useState(story.likes.length);
//   const [sharesCount, setSharesCount] = useState(story.shares.length);
//   const [comments, setComments] = useState(story.comments || []);
//   const [comment, setComment] = useState("");
//   const [commenting, setCommenting] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);

//   // Determine if content should be truncated (more than 150 characters)
//   const shouldTruncate = story.content.length > 150;
//   const truncatedContent = shouldTruncate
//     ? story.content.substring(0, 150) + "..."
//     : story.content;

//   // Like handler
//   const handleLike = async () => {
//     if (!currentUserId) return alert("Login to like!");
//     try {
//       const res = await fetch(`/api/stories/${story._id}/like`, {
//         method: "POST",
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setIsLiked(data.liked);
//         setLikesCount(data.likesCount);
//         onStoryUpdate?.();
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Comment handler
//   const handleComment = async () => {
//     if (!currentUserId) return alert("Login to comment!");
//     if (!comment.trim()) return;

//     try {
//       const res = await fetch(`/api/stories/${story._id}/comment`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content: comment }),
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setComments([...comments, data.comment]);
//         setComment("");
//         setCommenting(false);
//         onStoryUpdate?.();
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
//       {/* Story Image/Media */}
//       <div className="relative overflow-hidden">
//         {story.media.length > 0 && story.media[0].type === "image" ? (
//           <img
//             src={story.media[0].url}
//             alt={story.title}
//             className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
//           />
//         ) : story.media.length > 0 && story.media[0].type === "video" ? (
//           <video
//             src={story.media[0].url}
//             className="w-full h-64 object-cover"
//             controls
//           />
//         ) : (
//           <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
//             <div className="text-center">
//               <MessageCircle className="h-12 w-12 text-blue-400 mx-auto mb-2" />
//               <p className="text-blue-600 font-medium">Story</p>
//             </div>
//           </div>
//         )}

//         {/* Category Badge */}
//         <div className="absolute top-4 left-4">
//           <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
//             {story.category}
//             {story.isPremium && (
//               <Crown className="h-3 w-3 ml-1 text-yellow-300" />
//             )}
//           </span>
//         </div>

//         {/* Options Button */}
//         <div className="absolute top-4 right-4">
//           <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
//             <MoreHorizontal className="h-4 w-4 text-gray-600" />
//           </button>
//         </div>
//       </div>

//       {/* Story Content */}
//       <div className="p-6">
//         {/* Author Info */}
//         <div className="flex items-center space-x-3 mb-4">
//           <Avatar className="h-10 w-10">
//             <AvatarImage src={story.author?.image || "/default-avatar.png"} />
//             <AvatarFallback>{story.author?.name?.[0] || "U"}</AvatarFallback>
//           </Avatar>
//           <div>
//             <p className="font-semibold text-gray-900">{story.author?.name || "Unknown"}</p>
//             <p className="text-sm text-gray-600">
//               {story.author?.location ||
//                 formatDistanceToNow(new Date(story.createdAt), {
//                   addSuffix: true,
//                 })}
//             </p>
//           </div>
//         </div>

//         {/* Story Title and Content */}
//         <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
//           {story.title}
//         </h3>

//         <div className="text-gray-600 mb-4">
//           <p className="leading-relaxed">
//             {isExpanded ? story.content : truncatedContent}
//           </p>

//           {shouldTruncate && (
//             <button
//               onClick={() => setIsExpanded(!isExpanded)}
//               className="inline-flex items-center space-x-1 mt-3 text-blue-600 hover:text-blue-700 font-medium transition-colors"
//             >
//               <span>{isExpanded ? "Read less" : "Read more"}</span>
//               {isExpanded ? (
//                 <ChevronUp className="h-4 w-4" />
//               ) : (
//                 <ChevronDown className="h-4 w-4" />
//               )}
//             </button>
//           )}
//         </div>

//         {/* Tags */}
//         {story.tags && story.tags.length > 0 && (
//           <div className="flex flex-wrap gap-2 mb-4">
//             {story.tags.map((tag) => (
//               <span
//                 key={tag}
//                 className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium hover:bg-blue-100 hover:text-blue-600 transition-colors cursor-pointer"
//               >
//                 #{tag}
//               </span>
//             ))}
//           </div>
//         )}

//         {/* Stats */}
//         <div className="flex items-center space-x-6 mb-4 text-sm text-gray-500">
//           {story.views && (
//             <div className="flex items-center space-x-1">
//               <Eye className="h-4 w-4" />
//               <span>{story.views.toLocaleString()}</span>
//             </div>
//           )}
//           <div className="flex items-center space-x-1">
//             <Heart className="h-4 w-4" />
//             <span>{likesCount}</span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <MessageCircle className="h-4 w-4" />
//             <span>{comments.length}</span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <Share2 className="h-4 w-4" />
//             <span>{sharesCount}</span>
//           </div>
//         </div>

//         {/* Comment input */}
//         {commenting && currentUserId && (
//           <div className="mb-4 p-4 bg-gray-50 rounded-lg">
//             <input
//               type="text"
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="Write a comment..."
//               className="w-full p-3 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <div className="flex space-x-2">
//               <Button
//                 size="sm"
//                 onClick={handleComment}
//                 className="bg-blue-600 hover:bg-blue-700"
//               >
//                 Post Comment
//               </Button>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 onClick={() => setCommenting(false)}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         )}

//         {/* Comments list */}
//         {comments.length > 0 && (
//           <div className="mb-4 space-y-3">
//             <h4 className="font-medium text-gray-900">Comments</h4>
//             {comments.slice(0, 3).map((c, idx) => (
//               <div
//                 key={idx}
//                 className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700"
//               >
//                 {c.content}
//               </div>
//             ))}
//             {comments.length > 3 && (
//               <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
//                 View all {comments.length} comments
//               </button>
//             )}
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 border-t border-gray-100">
//           <button
//             onClick={handleLike}
//             className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//               isLiked
//                 ? "bg-red-100 text-red-600 hover:bg-red-200"
//                 : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
//             }`}
//           >
//             <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
//             <span>Like</span>
//             <span className="bg-white px-2 py-1 rounded-full text-xs">
//               {likesCount}
//             </span>
//           </button>

//           <button
//             onClick={() => setCommenting(!commenting)}
//             className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
//           >
//             <MessageCircle className="h-4 w-4" />
//             <span>Comment</span>
//             <span className="bg-white px-2 py-1 rounded-full text-xs">
//               {comments.length}
//             </span>
//           </button>

//           <button
//             onClick={async () => {
//               try {
//                 const url = `${window.location.origin}/stories/${story._id}`;
//                 await navigator.clipboard.writeText(url);
//                 setSharesCount((c) => c + 1);
//                 toast.success("Link copied to clipboard");
//               } catch (_) {
//                 toast.error("Failed to copy link");
//               }
//             }}
//             className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
//           >
//             <Share2 className="h-4 w-4" />
//             <span>Share</span>
//             <span className="bg-white px-2 py-1 rounded-full text-xs">{sharesCount}</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


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
  X,
  Copy,
  Check,
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
    currentUserName: string;
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
  onLike?: () => Promise<void>;
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

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

  // Share handlers
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/stories/${story._id}`;
  const shareText = `Check out this story: ${story.title}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard!");
      
      // Increment shares count
      await fetch(`/api/stories/${story._id}/share`, {
        method: "POST",
        credentials: "include",
      });
      setSharesCount((c) => c + 1);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleWhatsAppShare = async () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
    
    // Increment shares count
    await fetch(`/api/stories/${story._id}/share`, {
      method: "POST",
      credentials: "include",
    });
    setSharesCount((c) => c + 1);
    setShowShareModal(false);
  };

  const handleFacebookShare = async () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    
    // Increment shares count
    await fetch(`/api/stories/${story._id}/share`, {
      method: "POST",
      credentials: "include",
    });
    setSharesCount((c) => c + 1);
    setShowShareModal(false);
  };

  const handleTwitterShare = async () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    
    // Increment shares count
    await fetch(`/api/stories/${story._id}/share`, {
      method: "POST",
      credentials: "include",
    });
    setSharesCount((c) => c + 1);
    setShowShareModal(false);
  };

  return (
    <>
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
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleLike}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
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
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Comment</span>
              <span className="bg-white px-2 py-1 rounded-full text-xs">
                {comments.length}
              </span>
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
              <span className="bg-white px-2 py-1 rounded-full text-xs">{sharesCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            {/* Modal Header */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Share Story</h3>
            <p className="text-gray-600 mb-6">Share this story with your friends</p>

            {/* Share Options */}
            <div className="space-y-3">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppShare}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-green-50 transition-colors group"
              >
                <div className="bg-green-500 p-3 rounded-full group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-500">Share via WhatsApp</p>
                </div>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebookShare}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors group"
              >
                <div className="bg-blue-600 p-3 rounded-full group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Facebook</p>
                  <p className="text-sm text-gray-500">Share on Facebook</p>
                </div>
              </button>

              {/* Twitter */}
              <button
                onClick={handleTwitterShare}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-sky-50 transition-colors group"
              >
                <div className="bg-sky-500 p-3 rounded-full group-hover:scale-110 transition-transform">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Twitter</p>
                  <p className="text-sm text-gray-500">Share on Twitter</p>
                </div>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="bg-gray-600 p-3 rounded-full group-hover:scale-110 transition-transform">
                  {copied ? (
                    <Check className="h-6 w-6 text-white" />
                  ) : (
                    <Copy className="h-6 w-6 text-white" />
                  )}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">
                    {copied ? "Link Copied!" : "Copy Link"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {copied ? "Link copied to clipboard" : "Copy link to clipboard"}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}