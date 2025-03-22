import { StyleSheet, Button } from "react-native";
import { Text, View } from "@/components/Themed";
import DefaultHeader from "../components/DefaultHeader";
import LivePage from "../components/livePageComponents";
import FloatingActionButton from "../components/floatActionButton";
import { useRouter } from "expo-router";
export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={{ height: "100%" }}>
      <DefaultHeader title="ホーム" showSettingButton={true} />
      <View style={styles.container}>
        <LivePage title="【Alive Talk】テスト配信！" thumbnail={true} ownerName="yomi4486" />
      </View>
      <FloatingActionButton onPress={() => {router.navigate("/new")}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
