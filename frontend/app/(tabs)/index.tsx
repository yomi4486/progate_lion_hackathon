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
    <View style={{height: "100%"}}>
    <DefaultHeader title="ホーム" showSettingButton={true}/>
    <Authenticator.Provider>
      <Authenticator>
        <View style={styles.container}>
          <Text style={styles.title}>こんにちは！これはホーム画面です</Text>
        </View>
      </Authenticator>
    </Authenticator.Provider>
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
