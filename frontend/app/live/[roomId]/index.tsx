import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { LiveKitRoom } from "@livekit/react-native";
import * as RoomUtils from "@/app/lib/room";
import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import {AudioSession} from "@livekit/react-native";

export default function PostDetails() {
  const { roomId } = useLocalSearchParams();
  console.log(roomId as string);
  const [roomToken, setRoomToken] = useState<string | null>(null);
  useEffect(() => {
    const data = async () => {
      const session = await fetchAuthSession();
      const res = await RoomUtils.getRoomFromId(
        session.tokens?.idToken?.toString()!,
        roomId as string,
      );
      setRoomToken(res?.token!);
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
          audio={true}
        ></LiveKitRoom>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
