"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import { Search, Filter, Heart, Crown } from "lucide-react";
import StoryCard from "@/components/StoryCards";
import { motion } from "framer-motion";

export default function StoriesPage() {
  const { data: session } = useSession();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Improve perceived speed by prefetching stories detail route when hovering
  // and enabling smooth scrolling is handled globally

  const CreateStoryModal = dynamic(() => import("@/components/CreateStoryModal"), {
    ssr: false,
    loading: () => (
      <div className="h-10 w-40 rounded-xl bg-gray-200 animate-pulse" aria-hidden />
    ),
  });

  const categories = ["all", "Family", "Friend", "Place", "Kings", "Kingdoms"];

  useEffect(() => {
    fetchStories();
  }, [selectedCategory]);

  const fetchStories = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      const response = await fetch(`/api/stories?${params}`);
      if (response.ok) {
        const data = await response.json();
        setStories(data.stories);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStories = stories.filter(
    (story: any) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col text-center justify-center items-center mt-7  ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="relative">
                <Heart className="h-10 w-10 text-blue-600 fill-current" />
                <Crown className="h-5 w-5 text-blue-400 absolute -top-1 -right-1" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Legacy Stories
              </h1>
            </div>
            <p className="text-md md:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover inspiring stories from our community. Each tale is a
              precious thread in the tapestry of human experience.
            </p>
          </motion.div>
          {session && (
            <div className="mt-4 md:mt-0 mb-4">
              <CreateStoryModal onStoryCreated={fetchStories} />
            </div>
          )}
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search stories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center shadow-lg transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-transparent border border-gray-300 text-gray-700 hover:from-blue-600 hover:to-purple-600"
                    }`}
                  >
                    {category === "all" ? "All Categories" : category}
                  </motion.button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No stories found</p>
              {session && <CreateStoryModal onStoryCreated={fetchStories} />}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 ">
            {filteredStories.map((story: any) => (
              <StoryCard
                key={story._id}
                story={story}
                currentUserId={session?.user?.id}
                onLike={fetchStories}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
