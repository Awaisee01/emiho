"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Video, Users, Clock, ArrowLeft } from "lucide-react";

export default function EventDetailPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetch(`/api/events/${eventId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.event) setEvent(data.event);
        })
        .finally(() => setLoading(false));
    }
  }, [eventId]);

  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <p className="text-gray-500">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <p className="text-gray-500 mb-4">Event not found</p>
        <Button onClick={() => router.push("/events")}>Back to Events</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 flex items-center space-x-2"
          onClick={() => router.push("/events")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Events</span>
        </Button>

        {/* Event Card */}
        <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
            <p className="text-sm opacity-90">{event.category}</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <p className="text-gray-700 leading-relaxed">{event.description}</p>

            {/* Date & Location */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">
                  {format(new Date(event.date), "PPP p")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {event.location.type === "virtual" ? (
                  <Video className="h-5 w-5 text-gray-500" />
                ) : (
                  <MapPin className="h-5 w-5 text-gray-500" />
                )}
                <span className="text-gray-700">
                  {event.location.type === "virtual"
                    ? "Virtual Event"
                    : event.location.address || "Physical Location"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">
                  {event.attendees?.length || 0} attending
                </span>
              </div>
            </div>

            {/* Organizer */}
            <div className="flex items-center space-x-3 pt-4 border-t">
              <Avatar className="h-10 w-10">
                <AvatarImage src={event.organizer.image} />
                <AvatarFallback>
                  {event.organizer.name?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-800">
                  {event.organizer.name}
                </p>
                <p className="text-sm text-gray-500">Organizer</p>
              </div>
            </div>

            {/* Join / View Button */}
            {/* Join / View Button */}
            <div className="pt-6">
              {event.location.type === "virtual" ? (
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  onClick={() => {
                    // If you want random room every time
                    // const roomId = Math.random().toString(36).substring(2, 8);
                    // router.push(`/video/${roomId}`);

                    // 👇 Better: use the event._id so all attendees join the same room
                    router.push(`/video/${event._id}`);
                  }}
                >
                  Join Virtual Event
                </Button>
              ) : (
                <Button className="w-full" variant="outline">
                  View Location on Map
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
