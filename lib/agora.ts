// // lib/agora.ts
// import AgoraRTC, { IAgoraRTCClient, ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";

// let client: IAgoraRTCClient;
// let localAudioTrack: ILocalAudioTrack | null = null;
// let localVideoTrack: ILocalVideoTrack | null = null;

// export const initClient = () => {
//   client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
//   return client;
// };

// export const joinChannel = async (
//   appId: string,
//   channel: string,
//   token: string | null,
//   uid: string | number
// ) => {
//   await client.join(appId, channel, token || null, uid);

//   localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
//   localVideoTrack = await AgoraRTC.createCameraVideoTrack();

//   // Play local video
//   const localContainer = document.getElementById("local-player") as HTMLElement;
//   localContainer && localVideoTrack.play(localContainer);

//   // Publish local tracks
//   await client.publish([localAudioTrack, localVideoTrack]);
// };

// export const leaveChannel = async () => {
//   if (localAudioTrack) {
//     localAudioTrack.stop();
//     localAudioTrack.close();
//     localAudioTrack = null;
//   }
//   if (localVideoTrack) {
//     localVideoTrack.stop();
//     localVideoTrack.close();
//     localVideoTrack = null;
//   }
//   await client.leave();
// };




import AgoraRTC, { IAgoraRTCClient, ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";

let client: IAgoraRTCClient;
let localAudioTrack: ILocalAudioTrack | null = null;
let localVideoTrack: ILocalVideoTrack | null = null;

export const initClient = () => {
  client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  return client;
};

export const joinChannel = async (
  appId: string,
  channel: string,
  token: string,
  uid: string | number
) => {
  await client.join(appId, channel, token, uid);

  localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  localVideoTrack = await AgoraRTC.createCameraVideoTrack();

  const localContainer = document.getElementById("local-player") as HTMLElement;
  if (localContainer) localVideoTrack.play(localContainer);

  await client.publish([localAudioTrack, localVideoTrack]);
};

export const leaveChannel = async () => {
  if (localAudioTrack) {
    localAudioTrack.stop();
    localAudioTrack.close();
    localAudioTrack = null;
  }
  if (localVideoTrack) {
    localVideoTrack.stop();
    localVideoTrack.close();
    localVideoTrack = null;
  }
  await client.leave();
};
