// "use client";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Textarea } from "@/components/ui/textarea";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import dynamic from "next/dynamic";
// import { Search, Users, Plus, Crown, ArrowRight, Share2 } from "lucide-react";
// import { toast } from "sonner";
// import { motion } from "framer-motion";

// const communitySchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   description: z.string().min(1, "Description is required"),
//   category: z.string().min(1, "Category is required"),
// });

// type CommunityFormData = z.infer<typeof communitySchema>;

// export default function CommunityPage() {
//   const { data: session } = useSession();
//   const [communities, setCommunities] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [open, setOpen] = useState(false);
//   const [successOpen, setSuccessOpen] = useState(false);
//   // Lazy-load heavy pieces if any in future (example placeholder)
//   // const HeavyComponent = dynamic(() => import('./HeavyComponent'), { ssr: false });

//   const form = useForm<CommunityFormData>({
//     resolver: zodResolver(communitySchema),
//     defaultValues: { name: "", description: "", category: "" },
//   });

//   const router = useRouter();

//   useEffect(() => {
//     fetchCommunities();
//   }, [searchTerm]);

//   const fetchCommunities = async () => {
//     try {
//       const params = new URLSearchParams();
//       if (searchTerm) params.append("search", searchTerm);

//       const response = await fetch(`/api/communities?${params}`);
//       if (response.ok) {
//         const data = await response.json();
//         setCommunities(data.communities);
//       }
//     } catch (error) {
//       console.error("Error fetching communities:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onSubmit = async (data: CommunityFormData) => {
//     try {
//       const response = await fetch("/api/communities", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       if (response.ok) {
//         form.reset();
//         setOpen(false);
//         fetchCommunities();
//         setSuccessOpen(true);
//       } else if (response.status === 403) {
//         const body = await response.json().catch(() => ({} as any));
//         toast.info(body?.error || "Please upgrade your plan to create communities");
//         router.push("/pricing");
//       } else if (response.status === 401) {
//         toast.error("Please sign in first");
//         router.push("/auth/signin");
//       } else {
//         const body = await response.json().catch(() => ({} as any));
//         toast.error(body?.error || "Failed to create community");
//       }
//     } catch (error) {
//       console.error("Error creating community:", error);
//       toast.error("Something went wrong creating the community");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading communities...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex flex-col text-center justify-center items-center my-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-8">Discover Communities</h1>
//           <p className="text-gray-600 text-lg max-w-2xl mb-8">
//             Connect with others who share your interests, heritage, or experiences. Join existing communities or create your own legacy space.
//           </p>

//           {/* Create Community Button */}
//           {session && (
//             <>
//             <Dialog open={open} onOpenChange={setOpen}>
//               <DialogTrigger asChild>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center space-x-2 mx-auto"
//                 >
//                   <Plus className="h-5 w-5" />
//                   <span>Create Community</span>
//                 </motion.button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Create New Community</DialogTitle>
//                 </DialogHeader>
//                 <Form {...form}>
//                   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                     <FormField
//                       control={form.control}
//                       name="name"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Community Name</FormLabel>
//                           <FormControl>
//                             <Input placeholder="Enter community name" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="description"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Description</FormLabel>
//                           <FormControl>
//                             <Textarea placeholder="Describe your community" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="category"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Category</FormLabel>
//                           <FormControl>
//                             <Input placeholder="e.g., Family, Memorial, Support" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <div className="flex justify-end space-x-2">
//                       <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
//                       <Button type="submit">Create Community</Button>
//                     </div>
//                   </form>
//                 </Form>
//               </DialogContent>
//             </Dialog>

//             <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
//               <DialogContent className="max-w-md">
//                 <DialogHeader>
//                   <DialogTitle>Community Created Successfully</DialogTitle>
//                 </DialogHeader>
//                 <div className="py-2 text-sm text-gray-600">
//                   Your community has been created.
//                 </div>
//                 <div className="flex justify-end gap-2">
//                   <Button variant="outline" onClick={() => setSuccessOpen(false)}>Close</Button>
//                   <Button onClick={() => { setSuccessOpen(false); router.push('/community'); }}>Go to Communities</Button>
//                 </div>
//               </DialogContent>
//             </Dialog>
//             </>
//           )}
//         </div>

//         {/* Search */}
//         <Card className="mb-8">
//           <CardContent className="pt-6">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <Input
//                 placeholder="Search communities..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Communities Grid */}
//         {communities.length === 0 ? (
//           <Card>
//             <CardContent className="text-center py-12">
//               <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500 text-lg mb-4">No communities found</p>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//             {communities.map((community) => {
//               // members may be populated objects or ObjectId strings
//               const isMember = session
//                 ? community.members.some((m: any) => {
//                     const memberId = typeof m === 'string' ? m : m?._id || m?.id || m;
//                     return memberId?.toString() === session.user.id;
//                   })
//                 : false;

//               return (
//                 <Card key={community._id} className="hover:shadow-lg transition-shadow">
//                   <CardHeader>
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <CardTitle className="flex items-center">
//                           {community.name}
//                           {community.isPremium && <Crown className="h-4 w-4 ml-2 text-yellow-500" />}
//                         </CardTitle>
//                         <Badge variant="outline" className="mt-2">{community.category}</Badge>
//                       </div>
//                     </div>
//                   </CardHeader>

//                   <CardContent>
//                     <p className="text-gray-600 mb-4">{community.description}</p>

//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center gap-2">
//                         <Users className="h-4 w-4 text-gray-400" />
//                         <span className="text-sm text-gray-500">{community.members.length} members</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Avatar className="h-6 w-6">
//                           <AvatarImage src={community.creator?.image || "/default-avatar.png"} />
//                           <AvatarFallback className="text-xs">{community.creator?.name?.[0] || "U"}</AvatarFallback>
//                         </Avatar>
//                         <span className="text-sm text-gray-500">by {community.creator.name}</span>
//                       </div>
//                     </div>

//                     {/* Join / Open Button */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       className={`w-full py-2 text-sm mt-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors ${
//                         isMember ? "bg-green-600 text-white hover:bg-green-700" : "bg-blue-600 text-white hover:bg-blue-700"
//                       }`}
//                       onClick={async () => {
//                         if (!session?.user?.id) return router.push("/api/auth/signin");

//                         if (isMember) {
//                           router.push(`/community/${community._id}`);
//                         } else {
//                           try {
//                             const res = await fetch(`/api/communities/${community._id}/join`, { method: "POST" });
//                             if (res.ok) {
//                               setCommunities((prev) =>
//                                 prev.map((c) =>
//                                   c._id === community._id
//                                     ? { ...c, members: [...c.members, { _id: session.user.id }] }
//                                     : c
//                                 )
//                               );
//                             } else if (res.status === 403) {
//                               const data = await res.json();
//                               toast.info(data?.error || 'Please upgrade your plan to join communities');
//                               router.push('/pricing');
//                             } else if (res.status === 401) {
//                               toast.error('Please sign in first');
//                               router.push('/auth/signin');
//                             }
//                           } catch (err) {
//                             console.error("Error joining community:", err);
//                             toast.error('Failed to join community');
//                           }
//                         }
//                       }}
//                     >
//                       <span>{isMember ? "Open Community" : "Join Community"}</span>
//                       <ArrowRight className="h-4 w-4" />
//                     </motion.button>

//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       className="w-full py-2 text-sm mt-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
//                       onClick={async () => {
//                         const url = `${window.location.origin}/community/${community._id}`;
//                         try {
//                           await navigator.clipboard.writeText(url);
//                           toast.success('Community link copied');
//                         } catch (_) {}
//                       }}
//                     >
//                       <Share2 className="h-4 w-4" />
//                       <span>Share</span>
//                     </motion.button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dynamic from "next/dynamic";
import { Search, Users, Plus, Crown, ArrowRight, Share2, X, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const communitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
});

type CommunityFormData = z.infer<typeof communitySchema>;

export default function CommunityPage() {
  const { data: session } = useSession();
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<CommunityFormData>({
    resolver: zodResolver(communitySchema),
    defaultValues: { name: "", description: "", category: "" },
  });

  const router = useRouter();

  useEffect(() => {
    fetchCommunities();
  }, [searchTerm]);

  const fetchCommunities = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/communities?${params}`);
      if (response.ok) {
        const data = await response.json();
        setCommunities(data.communities);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CommunityFormData) => {
    try {
      const response = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        form.reset();
        setOpen(false);
        fetchCommunities();
        setSuccessOpen(true);
      } else if (response.status === 403) {
        const body = await response.json().catch(() => ({} as any));
        toast.info(body?.error || "Please upgrade your plan to create communities");
        router.push("/pricing");
      } else if (response.status === 401) {
        toast.error("Please sign in first");
        router.push("/auth/signin");
      } else {
        const body = await response.json().catch(() => ({} as any));
        toast.error(body?.error || "Failed to create community");
      }
    } catch (error) {
      console.error("Error creating community:", error);
      toast.error("Something went wrong creating the community");
    }
  };

  // Share handlers
  const handleOpenShareModal = (community: any) => {
    setSelectedCommunity(community);
    setShareModalOpen(true);
    setCopied(false);
  };

  const shareUrl = selectedCommunity 
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/community/${selectedCommunity._id}`
    : '';
  const shareText = selectedCommunity 
    ? `Check out this community: ${selectedCommunity.name}`
    : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
    setShareModalOpen(false);
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    setShareModalOpen(false);
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    setShareModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading communities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col text-center justify-center items-center my-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Discover Communities</h1>
          <p className="text-gray-600 text-lg max-w-2xl mb-8">
            Connect with others who share your interests, heritage, or experiences. Join existing communities or create your own legacy space.
          </p>

          {/* Create Community Button */}
          {session && (
            <>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center space-x-2 mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Community</span>
                </motion.button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Community</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Community Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter community name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe your community" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Family, Memorial, Support" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                      <Button type="submit">Create Community</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Community Created Successfully</DialogTitle>
                </DialogHeader>
                <div className="py-2 text-sm text-gray-600">
                  Your community has been created.
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSuccessOpen(false)}>Close</Button>
                  <Button onClick={() => { setSuccessOpen(false); router.push('/community'); }}>Go to Communities</Button>
                </div>
              </DialogContent>
            </Dialog>
            </>
          )}
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Communities Grid */}
        {communities.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">No communities found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {communities.map((community) => {
              // members may be populated objects or ObjectId strings
              const isMember = session
                ? community.members.some((m: any) => {
                    const memberId = typeof m === 'string' ? m : m?._id || m?.id || m;
                    return memberId?.toString() === session.user.id;
                  })
                : false;

              return (
                <Card key={community._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center">
                          {community.name}
                          {community.isPremium && <Crown className="h-4 w-4 ml-2 text-yellow-500" />}
                        </CardTitle>
                        <Badge variant="outline" className="mt-2">{community.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-600 mb-4">{community.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{community.members.length} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={community.creator?.image || "/default-avatar.png"} />
                          <AvatarFallback className="text-xs">{community.creator?.name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-500">by {community.creator.name}</span>
                      </div>
                    </div>

                    {/* Join / Open Button */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-2 text-sm mt-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors ${
                        isMember ? "bg-green-600 text-white hover:bg-green-700" : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      onClick={async () => {
                        if (!session?.user?.id) return router.push("/api/auth/signin");

                        if (isMember) {
                          router.push(`/community/${community._id}`);
                        } else {
                          try {
                            const res = await fetch(`/api/communities/${community._id}/join`, { method: "POST" });
                            if (res.ok) {
                              setCommunities((prev) =>
                                prev.map((c) =>
                                  c._id === community._id
                                    ? { ...c, members: [...c.members, { _id: session.user.id }] }
                                    : c
                                )
                              );
                            } else if (res.status === 403) {
                              const data = await res.json();
                              toast.info(data?.error || 'Please upgrade your plan to join communities');
                              router.push('/pricing');
                            } else if (res.status === 401) {
                              toast.error('Please sign in first');
                              router.push('/auth/signin');
                            }
                          } catch (err) {
                            console.error("Error joining community:", err);
                            toast.error('Failed to join community');
                          }
                        }
                      }}
                    >
                      <span>{isMember ? "Open Community" : "Join Community"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2 text-sm mt-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                      onClick={() => handleOpenShareModal(community)}
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </motion.button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {shareModalOpen && selectedCommunity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShareModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            {/* Modal Header */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Share Community</h3>
            <p className="text-gray-600 mb-6">Share "{selectedCommunity.name}" with others</p>

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
    </div>
  );
}