import { RtcRole, RtcTokenBuilder } from "agora-access-token";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel");

  if (!channel) {
    return new Response(JSON.stringify({ error: "Missing channel" }), { status: 400 });
  }

  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
  const appCertificate = process.env.AGORA_APP_CERT!;
  const uid = 0; // 0 = let Agora auto-assign
  const role = RtcRole.PUBLISHER;
  const expireTime = 3600; // 1 hour

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channel,
    uid,
    role,
    Math.floor(Date.now() / 1000) + expireTime
  );

  return new Response(JSON.stringify({ token }));
}
