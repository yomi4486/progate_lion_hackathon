import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
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
import { AppType } from "../../../../backend/src";
const { hc } = require("hono/dist/client") as typeof import("hono/client");
import { Feather } from "@expo/vector-icons";
import type { InferRequestType, InferResponseType } from "hono/client";
import * as CommentTools from "@/app/lib/comment";
const client = hc<AppType>(process.env.EXPO_PUBLIC_BASE_URL!);
const roomIdFromGet = client.comments[":roomId"];

export default function PostDetails() {
  const { roomId } = useLocalSearchParams();
  const [roomToken, setRoomToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [comments, setComments] = useState<
    InferResponseType<typeof roomIdFromGet.$get, 200>
  >({ comments: [] });
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
          <RoomView username={userId} roomId={roomId as string} />
        </LiveKitRoom>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

const RoomView = ({
  username,
  roomId,
}: {
  username: string | null;
  roomId: string;
}) => {
  // Get all camera tracks.
  const room = useRoomContext();
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(username));
  room.localParticipant.publishData(data, { reliable: false });
  const tracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { room: room },
  );
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<
    InferResponseType<typeof roomIdFromGet.$get, 200>
  >({ comments: [] });

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
  setInterval(() => {
    const data = async () => {
      const session = await fetchAuthSession();
      const res = await CommentTools.getComment(
        session.tokens?.idToken?.toString()!,
        roomId,
      );
      if (res?.comments != undefined) setComments(res?.comments);
    };
    data();
  }, 1000);

  useEffect(() => {}, [comments]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ position: "absolute" }}>
          <FlatList
            data={comments.comments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <Text style={styles.commentText}>{item["comment"]}</Text>
              </View>
            )}
          />
        </View>
        <FlatList data={tracks} renderItem={renderTrack} />
        <KeyboardAvoidingView style={styles.footer}>
          <View style={styles.fixedFooter}>
            <View style={{ width: "80%" }}>
              <TextInput
                onChangeText={(t) => {
                  setComment(t);
                }}
                style={{
                  height: 40,
                  width: "100%",
                  borderColor: "brack",
                  borderWidth: 0.5,
                  borderRadius: 50,
                  marginBottom: 15,
                  paddingHorizontal: 10,
                }}
              />
            </View>
            <TouchableOpacity
              onPress={async () => {
                const session = await fetchAuthSession();
                CommentTools.createCommnet(
                  session.tokens?.idToken?.toString()!,
                  comment,
                  0,
                  roomId,
                );
              }}
            >
              <Feather name="arrow-up-circle" size={40} color={"#000000"} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  input: {
    width: "90%",
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  footer: {
    justifyContent: "flex-end",
    position: "fixed",
  },
  fixedFooter: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    flexDirection: "row", // 要素を横並びに配置
    justifyContent: "space-between",
    marginBottom: 30,
  },
  button: {
    padding: 10, // ボタンのタッチ領域を広げる
    borderRadius: 50, // 丸いボタンを作成する場合
  },
  commentContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  commentText: {
    fontSize: 16,
  },
});
