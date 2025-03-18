import { VideoPlayer } from "./components/VideoPlayer";
import type { VideoView } from "expo-video";
import { useRef } from "react";

const videoSource =
  "https://ddf2701962c1.ap-northeast-1.playback.live-video.net/api/video/v1/ap-northeast-1.982081087394.channel.prQqJDT21oGo.m3u8";

export default function VideoScreen() {
  const ref = useRef<VideoView>(null);

  return (
      <VideoPlayer source={videoSource} videoRef={ref} />
  );
}