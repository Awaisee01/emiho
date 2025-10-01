"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Video,
  Plus,
  Crown,
  Users,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  category: z.string().min(1, "Category is required"),
  locationType: z.enum(["virtual", "physical"]),
  address: z.string().optional(),
  meetingLink: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function EventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(true);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      category: "",
      locationType: "virtual",
      address: "",
      meetingLink: "",
    },
  });

  const locationType = form.watch("locationType");

  useEffect(() => {
    fetchEvents();
  }, [showUpcoming]);
  // Prefetching for speed is handled in the navbar

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (showUpcoming) {
        params.append("upcoming", "true");
      }

      const response = await fetch(`/api/events?${params}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: EventFormData) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          location: {
            type: data.locationType,
            address:
              data.locationType === "physical" ? data.address : undefined,
            meetingLink:
              data.locationType === "virtual" ? data.meetingLink : undefined,
          },
        }),
      });

      if (response.ok) {
        form.reset();
        setOpen(false);
        fetchEvents();
        setSuccessOpen(true);
      } else if (response.status === 403) {
        const body = await response.json().catch(() => ({} as any));
        toast.info(body?.error || "Please upgrade your plan to create events");
        router.push("/pricing");
      } else if (response.status === 401) {
        toast.error("Please sign in first");
        router.push("/auth/signin");
      } else {
        const body = await response.json().catch(() => ({} as any));
        toast.error(body?.error || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Something went wrong creating the event");
    }
  };
  
  const router = useRouter();
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading Events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-gray-600">
              Organize and attend memorial gatherings and celebrations
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <Button
                variant={showUpcoming ? "default" : "outline"}
                size="sm"
                onClick={() => setShowUpcoming(true)}
              >
                Upcoming
              </Button>
              <Button
                variant={!showUpcoming ? "default" : "outline"}
                size="sm"
                onClick={() => setShowUpcoming(false)}
              >
                All Events
              </Button>
            </div>
            {session && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  {/* <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button> */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r  from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create Event</span>
                  </motion.button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter event title"
                                {...field}
                              />
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
                              <Textarea
                                placeholder="Describe your event"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date & Time</FormLabel>
                              <FormControl>
                                <Input type="datetime-local" {...field} />
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
                                <Input
                                  placeholder="e.g., Memorial, Celebration"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="locationType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="virtual">
                                  Virtual Event
                                </SelectItem>
                                <SelectItem value="physical">
                                  Physical Location
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {locationType === "physical" && (
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter event address"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      {locationType === "virtual" && (
                        <FormField
                          control={form.control}
                          name="meetingLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meeting Link</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Zoom/Meet link"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Create Event</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
            {/* Success Modal */}
            <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Event Created Successfully</DialogTitle>
                </DialogHeader>
                <div className="py-2 text-sm text-gray-600">
                  Your event has been created.
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSuccessOpen(false)}>Close</Button>
                  <Button onClick={() => { setSuccessOpen(false); router.push('/events'); }}>Go to Events</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">
                {showUpcoming ? "No upcoming events" : "No events found"}
              </p>
              <p className="text-gray-400 mb-6">
                Create memorial events to bring people together and celebrate
                memories
              </p>
              {session && (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r  from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center space-x-2 mx-auto"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Create Your first Event</span>
                    </motion.button>
                  </DialogTrigger>
                </Dialog>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event: any) => (
              <Card
                key={event._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-rose-500" />
                        {event.title}
                        {event.isPremium && (
                          <Crown className="h-4 w-4 ml-2 text-yellow-500" />
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {event.category}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{event.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {format(new Date(event.date), "PPP p")}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {event.location.type === "virtual" ? (
                        <Video className="h-4 w-4 text-gray-400" />
                      ) : (
                        <MapPin className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm text-gray-600">
                        {event.location.type === "virtual"
                          ? "Virtual Event"
                          : event.location.address || "Physical Location"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {event.attendees.length} attendees
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={event.organizer.image} />
                        <AvatarFallback className="text-xs">
                          {event.organizer.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-500">
                        by {event.organizer.name}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => router.push(`/events/${event._id}`)}
                    >
                      {new Date(event.date) > new Date()
                        ? "Join Event"
                        : "View Details"}
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => router.push(`/video/${event._id}`)}
                    >
                      Video Room
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
