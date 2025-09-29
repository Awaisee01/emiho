"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function StoryDetailPage() {
  const { id } = useParams();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`/api/stories/${id}`);
        const data = await res.json();
        if (res.ok) setStory(data.story);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Story not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{story.title}</h1>
      <p className="text-gray-600 mb-6">by {story.author?.name || 'Unknown'}</p>
      {story.media?.[0]?.type === 'image' && (
        <img src={story.media[0].url} alt={story.title} className="w-full rounded-lg mb-6" />
      )}
      <p className="whitespace-pre-wrap leading-7">{story.content}</p>
    </div>
  );
}


