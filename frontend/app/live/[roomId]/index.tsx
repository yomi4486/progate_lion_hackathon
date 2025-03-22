import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { LiveKitRoom } from "@livekit/react-native";
import * as RoomUtils from "@/app/lib/room";
import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

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
      console.log(res);
    };
    data();
  }, []);
  return (
    <View>
      {roomToken ? (
        <LiveKitRoom
          serverUrl="wss://progatehackathon-0vilmkur.livekit.cloud"
          token={roomId as string}
          connect={true}
          audio={true}
        ></LiveKitRoom>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
