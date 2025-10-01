"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { initClient, joinChannel, leaveChannel } from "@/lib/agora";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Copy } from "lucide-react";

export default function VideoRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const [joined, setJoined] = useState(false);
  const router = useRouter();

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between gap-2">
          <Button variant="outline" onClick={() => router.back()} className="shrink-0">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div className="flex items-center gap-2">
            {!joined ? (
              <Button onClick={handleJoin} className="bg-green-600 hover:bg-green-700 rounded-lg shadow-sm">
                Join
              </Button>
            ) : (
              <Button onClick={handleLeave} className="bg-red-600 hover:bg-red-700 rounded-lg shadow-sm">
                Leave
              </Button>
            )}
            <Button onClick={copyLink} className="bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm">
              <Copy className="h-4 w-4 mr-2" /> Invite Link
            </Button>
          </div>
        </div>

        <Card className="border border-gray-200 shadow-lg">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              Meeting Room: {roomId}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="w-full h-[220px] sm:h-[300px] bg-black rounded-xl overflow-hidden shadow-lg" id="local-player">
                {/* local video placeholder */}
              </div>
              <div className="min-h-[220px] sm:min-h-[300px]">
                <div id="remote-playerlist" className="grid grid-cols-1 gap-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
