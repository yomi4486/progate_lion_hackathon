import { StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";
import { Authenticator } from "@aws-amplify/ui-react-native";
import { Amplify } from "aws-amplify";
import awsconfig from "../../src/aws-exports";

Amplify.configure(awsconfig);

import { Text, View } from "@/components/Themed";
import DefaultHeader from "../components/DefaultHeader";

export default function TabOneScreen() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      router.push("/home"); // Replace '/AnotherScreen' with your target screen path
    } catch (error) {
      console.info("Error signing in", error);
    }
  };

  return (
    <Authenticator.Provider>
      <Authenticator>
        <View style={styles.container}>
          <DefaultHeader title="a" showSettingButton={true}/>
          <Text style={styles.title}>こんにちは！これはホーム画面です</Text>
        </View>
      </Authenticator>
    </Authenticator.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
