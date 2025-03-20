import { StyleSheet, Button, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import DefaultHeader from "../components/DefaultHeader";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const navigate = useRouter();
  return (
    <View style={{ height: "100%" }}>
      <DefaultHeader title="ホーム" showSettingButton={true} />
      <View style={styles.container}>
        <TouchableOpacity onPress={()=>{
          navigate.navigate("/room")
        }}>
        <Text style={styles.title}>こんにちは！これはホーム画面です</Text>
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
