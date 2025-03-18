import { useVideoPlayer, VideoView } from "expo-video";
import { StyleSheet } from "react-native";

type VideoPlayerProps = {
  source: string;
  videoRef: React.RefAttributes<VideoView>["ref"];
};

export function VideoPlayer({ source, videoRef }: VideoPlayerProps) {
  const player = useVideoPlayer(source, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <VideoView
      ref={videoRef}
      style={styles.video}
      player={player}
      allowsFullscreen
      allowsPictureInPicture
    />
  );
}

const styles = StyleSheet.create({
  video: {
    width: "100%",
    height: 240,
  },
});