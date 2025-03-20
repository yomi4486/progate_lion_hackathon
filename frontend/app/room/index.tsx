import * as React from "react";
import { StyleSheet, View, FlatList, ListRenderItem } from "react-native";
import { useEffect } from "react";
import {
  AudioSession,
  LiveKitRoom,
  useTracks,
  TrackReferenceOrPlaceholder,
  VideoTrack,
  isTrackReference,
} from "@livekit/react-native";
import { Track } from "livekit-client";

// !! Note !!
// This sample hardcodes a token which expires in 2 hours.
const wsURL = "wss://progatehackathon-0vilmkur.livekit.cloud";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI1NTA3NjgsImlzcyI6IkFQSVZxWFJMekZnRzNOaSIsIm5iZiI6MTc0MjQ2MDc2OCwic3ViIjoiMjAiLCJ2aWRlbyI6eyJjYW5QdWJsaXNoIjp0cnVlLCJjYW5QdWJsaXNoRGF0YSI6dHJ1ZSwiY2FuU3Vic2NyaWJlIjp0cnVlLCJyb29tIjoiaGFja2F0aG9uX3Rlc3QiLCJyb29tSm9pbiI6dHJ1ZX19.4che2yP5752nlTSZqp9r9D9yx1K5P0gappCz1bAjiQk";

export default function App() {
  // Start the audio session first.
  useEffect(() => {
    let start = async () => {
      await AudioSession.startAudioSession();
    };

    start();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  return (
    <LiveKitRoom
      serverUrl={wsURL}
      token={token}
      connect={true}
      options={{
        // Use screen pixel density to handle screens with differing densities.
        adaptiveStream: { pixelDensity: "screen" },
      }}
      audio={false}
      video={true}
    >
      <RoomView />
    </LiveKitRoom>
  );
}

const RoomView = () => {
  // Get all camera tracks.
  const tracks = useTracks([Track.Source.Camera]);

  const renderTrack: ListRenderItem<TrackReferenceOrPlaceholder> = ({
    item,
  }) => {
    // Render using the VideoTrack component.
    if (isTrackReference(item)) {
      return (
        <VideoTrack
          trackRef={item}
          style={styles.participantView}
          mirror={true}
        />
      );
    } else {
      return <View style={styles.participantView} />;
    }
  };

  return (
    <View>
      <FlatList data={tracks} renderItem={renderTrack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
  },
  participantView: {
    flex: 1,
    aspectRatio: 0.5,
  },
});
