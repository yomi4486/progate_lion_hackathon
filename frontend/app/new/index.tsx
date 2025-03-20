import {
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "@/components/Themed";
import DefaultHeader from "../components/DefaultHeader";
import { useRouter } from "expo-router";
import * as RoomUtils from "@/app/lib/room";
import { fetchAuthSession } from "aws-amplify/auth";

export default function HomeScreen() {
  const navigate = useRouter();
  return (
    <View style={{ height: "100%" }}>
      <DefaultHeader title="ホーム" showSettingButton={true} />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={async () => {
            const session = await fetchAuthSession();
            console.log("OK");
            const res = await RoomUtils.get_room(
              session.tokens?.idToken?.toString()!,
            );
            console.log(res);
          }}
        >
          <Text style={styles.title}>ルームの作成!!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
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
