import { StyleSheet, Button, ScrollView, RefreshControl } from "react-native";
import { Text, View } from "@/components/Themed";
import DefaultHeader from "../components/DefaultHeader";
import LivePage from "../components/livePageComponents";
import FloatingActionButton from "../components/floatActionButton";
import { useRouter } from "expo-router";
import * as RoomTools from "@/app/lib/room";
import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { AppType } from "../../../backend/src";
const { hc } = require("hono/dist/client") as typeof import("hono/client");
import type { InferRequestType, InferResponseType } from "hono/client";
const client = hc<AppType>(process.env.EXPO_PUBLIC_BASE_URL!);

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshNumber, setRefreshNumber] = useState<number>(0);
  const [rooms, setRooms] = useState<
    InferResponseType<typeof client.room.$get, 200>
  >([]);
  useEffect(() => {
    const data = async () => {
      const session = await fetchAuthSession();
      const res = await RoomTools.get_room(
        session.tokens?.idToken?.toString()!,
      );
      console.log(res);
      if (res != null){
        setRooms(res);
      }else{
        setRooms([]);
      }
    };
    data();
  }, [refreshNumber]);
  function pushToReload(): void {
    setRefreshing(true);
    setRefreshNumber(refreshNumber + 1);
    setRefreshing(false);
  }
  return (
    <View style={{ height: "100%" }}>
      <DefaultHeader title="ホーム" showSettingButton={true} />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={pushToReload} />
        }
      >
        {rooms.length != 0 ? rooms.reverse().map((item) => (
          <LivePage
            roomId={item.room_id}
            title={item.room_title}
            thumbnail={true}
            ownerName="yomi4486"
          />
        )):<Text>現在閲覧可能な配信はありません。</Text>}
      </ScrollView>
      <FloatingActionButton
        onPress={() => {
          router.navigate("/new");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
