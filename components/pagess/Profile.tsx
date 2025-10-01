"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User, Crown, Camera, MapPin, Globe } from "lucide-react";
import { toast } from "sonner"; // Add toast for notifications

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
  location: z
    .string()
    .max(100, "Location must not exceed 100 characters")
    .optional(),
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserProfile {
  bio?: string;
  location?: string;
  website?: string;
}

interface ExtendedUser {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  profile?: UserProfile;
  subscription?: {
    plan?: string;
  };
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPlan, setUserPlan] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      bio: "",
      location: "",
      website: "",
    },
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          const user = data.user as ExtendedUser;

          setUserProfile(user.profile || {});
          setUserPlan(user.subscription?.plan || null);

          // Update form with fetched data
          form.reset({
            name: user.name || "",
            bio: user.profile?.bio || "",
            location: user.profile?.location || "",
            website: user.profile?.website || "",
          });
          // If session doesn't yet reflect subscription (after webhook), ensure UI shows latest
          if (
            user.subscription?.plan &&
            user.subscription.plan !==
              (session.user as ExtendedUser)?.subscription?.plan
          ) {
            await update();
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchProfile();
  }, [session?.user?.id, form]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!session?.user?.id) {
      toast.error("Please sign in to update your profile");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          bio: data.bio || "",
          location: data.location || "",
          website: data.website || "",
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Update session with new data
        await update({
          ...session,
          user: {
            ...session.user,
            name: data.name,
            profile: {
              bio: data.bio || "",
              location: data.location || "",
              website: data.website || "",
            },
          },
        });

        // Update local state
        setUserProfile({
          bio: data.bio || "",
          location: data.location || "",
          website: data.website || "",
        });

        toast.success("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const { url } = await uploadResponse.json();

      // Update profile with new image URL
      const updateResponse = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url }),
      });

      if (updateResponse.ok) {
        if (session) {
          // ✅ check for null
          await update({
            ...session,
            user: {
              ...session.user,
              image: url,
            },
          });
        }

        toast.success("Profile picture updated successfully!");
      } else {
        throw new Error("Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setImageUploading(false);
      // Clear the input
      event.target.value = "";
    }
  };

  useEffect(() => {
    if (session) {
      console.log(
        "Session plan:",
        (session.user as ExtendedUser)?.subscription?.plan
      );
    }
  }, [session]);

  // From NextAuth session
  console.log(
    "Plan from session:",
    (session?.user as ExtendedUser)?.subscription?.plan
  );

  // Or from your local fetched userProfile if you add plan there
  console.log("Plan from fetched profile:", userProfile);

  // Show loading state if session is loading
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
          <TabsList className="grid grid-cols-1 sm:inline-flex w-full sm:w-auto">
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || "Profile picture"}
                      />
                      <AvatarFallback className="text-2xl">
                        {session.user?.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="avatar-upload"
                      className={`absolute -bottom-2 -right-2 bg-rose-500 text-white rounded-full p-2 cursor-pointer hover:bg-rose-600 transition-colors ${
                        imageUploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {imageUploading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={imageUploading}
                      />
                    </label>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold">
                      {session.user?.name || "Unknown User"}
                    </h3>
                    <p className="text-gray-600">{session.user?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className="flex items-center space-x-1"
                      >
                        <Crown className="h-3 w-3 text-yellow-500" />
                        <span>
                          {userPlan ||
                            (session.user as ExtendedUser)?.subscription
                              ?.plan ||
                            "Free"}{" "}
                          Plan
                        </span>
                      </Badge>
                    </div>
                  </div>
                </div>
          

                {/* Profile Form */}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about yourself..."
                              className="resize-none"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                  placeholder="City, Country"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                  placeholder="https://your-website.com"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || imageUploading}
                      className="w-full md:w-auto"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
