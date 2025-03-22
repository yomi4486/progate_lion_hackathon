import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import * as RoomUtils from "@/app/lib/room";
import * as UserUtils from "@/app/lib/user";
import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import {
  AudioSession,
  LiveKitRoom,
  useRoomContext,
  useTracks,
  TrackReferenceOrPlaceholder,
  VideoTrack,
  isTrackReference,
} from "@livekit/react-native";
import { RemoteTrack, RemoteVideoTrack, Room, Track } from "livekit-client";
import { StyleSheet, FlatList, ListRenderItem } from "react-native";

export default function PostDetails() {
  const { roomId } = useLocalSearchParams();
  const [roomToken, setRoomToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const data = async () => {
      const session = await fetchAuthSession();
      const res = await RoomUtils.getRoomFromId(
        session.tokens?.idToken?.toString()!,
        roomId as string,
      );
      setRoomToken(res?.token!);
      const userRes = await UserUtils.getMyProfile(
        session.tokens?.idToken?.toString()!,
      );
      if (userRes) setUserId(userRes.id);
    };
    data();
    let start = async () => {
      await AudioSession.startAudioSession();
    };

    start();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);
  return (
    <View>
      {roomToken ? (
        <LiveKitRoom
          serverUrl="wss://progatehackathon-0vilmkur.livekit.cloud"
          token={roomToken as string}
          connect={true}
          options={{
            adaptiveStream: { pixelDensity: "screen" },
          }}
          audio={false}
          video={false}
        >
          <RoomView username={userId} />
        </LiveKitRoom>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

const RoomView = ({ username }: { username: string | null }) => {
  // Get all camera tracks.
  const room = useRoomContext();
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(username));
  room.localParticipant.publishData(data, { reliable: false });
  const tracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { room: room },
  );
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
