"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VideoPage() {
  const router = useRouter();

  const createMeeting = () => {
    const roomId = Math.random().toString(36).substring(2, 8); // random 6-char id
    router.push(`/video/${roomId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <Card className="w-full max-w-md shadow-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-900">
            Start a Video Meeting
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <p className="text-gray-600 text-center">
            Instantly create a secure meeting room and share the invite link
            with your friends.
          </p>
          <Button
            size="lg"
            className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl text-lg font-medium shadow-md"
            onClick={createMeeting}
          >
            🚀 Create Meeting
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
