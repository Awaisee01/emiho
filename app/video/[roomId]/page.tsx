"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { initClient, joinChannel, leaveChannel } from "@/lib/agora";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function VideoRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const [joined, setJoined] = useState(false);

  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
  const uid = String(Math.floor(Math.random() * 10000));

  useEffect(() => {
    const client = initClient();

    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === "video") {
        const remoteContainer = document.createElement("div");
        remoteContainer.id = `remote-${user.uid}`;
        remoteContainer.className =
          "w-full h-[300px] bg-black rounded-xl overflow-hidden shadow-lg";
        document.getElementById("remote-playerlist")?.append(remoteContainer);
        user.videoTrack?.play(remoteContainer);
      }
      if (mediaType === "audio") {
        user.audioTrack?.play();
      }
    });

    client.on("user-unpublished", (user) => {
      document.getElementById(`remote-${user.uid}`)?.remove();
    });
  }, []);

  const handleJoin = async () => {
    const res = await fetch(`/api/agora-token?channel=${roomId}`);
    const { token } = await res.json();

    await joinChannel(appId, roomId, token, uid);
    setJoined(true);
    toast.success("🎉 You joined the meeting!");
  };

  const handleLeave = async () => {
    await leaveChannel();
    setJoined(false);
    toast.info("👋 You left the meeting.");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("🔗 Meeting link copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border border-gray-200 shadow-lg">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Meeting Room: {roomId}
            </CardTitle>
            <div className="flex gap-3">
              {!joined ? (
                <Button
                  onClick={handleJoin}
                  className="bg-green-600 hover:bg-green-700 rounded-lg shadow-sm"
                >
                  Join Meeting
                </Button>
              ) : (
                <Button
                  onClick={handleLeave}
                  className="bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
                >
                  Leave Meeting
                </Button>
              )}
              <Button
                onClick={copyLink}
                className="bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Copy Invite Link
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border border-gray-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">You</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                id="local-player"
                className="w-full h-[400px] bg-black rounded-xl flex items-center justify-center shadow-inner"
              >
                {!joined ? (
                  <span className="text-gray-400">Click Join to start</span>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Others</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                id="remote-playerlist"
                className="flex flex-wrap gap-4 justify-center"
              ></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
