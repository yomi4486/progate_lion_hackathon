import { StyleSheet, Button } from "react-native";
import { Amplify } from "aws-amplify";
import awsconfig from "../../src/aws-exports";

Amplify.configure(awsconfig);

import { Text, View } from "@/components/Themed";
import DefaultHeader from "../components/DefaultHeader";

export default function TabOneScreen() {
  return (
    <View style={{ height: "100%" }}>
      <DefaultHeader title="ホーム" showSettingButton={true} />
      <View style={styles.container}>
        <Text style={styles.title}>こんにちは！これはホーム画面です</Text>
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
