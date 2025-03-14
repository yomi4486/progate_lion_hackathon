import { StyleSheet, Button, TouchableOpacity } from "react-native";
import { Amplify } from "aws-amplify";
import { signOut } from "aws-amplify/auth";
import awsconfig from "../src/aws-exports";

Amplify.configure(awsconfig);

import { Text, View } from "@/components/Themed";
import DefaultHeader from "./components/DefaultHeader";
import SimpleModal from "./components/simpleModal";
import { useState } from "react";

export default function TabOneScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  return (
    <View style={{ height: "100%" }}>
      <SimpleModal
        visible={isModalVisible}
        visibleControler={() => {
          setModalVisible(false);
        }}
      >
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text
            style={{ paddingBottom: 10, fontSize: 20, textAlign: "center" }}
          >
            本当にログアウトしますか？
          </Text>
          <TouchableOpacity
            style={{
              padding: 10,
              width: "80%",
              backgroundColor: "#FF555544",
              borderRadius: 10,
            }}
            onPress={() => signOut()}
          >
            <Text style={styles.title}>OK</Text>
          </TouchableOpacity>
        </View>
      </SimpleModal>
      <DefaultHeader
        title="設定"
        showSettingButton={false}
        showBackButton={true}
      />
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            borderColor: "black",
            padding: 10,
            width: "80%",
            backgroundColor: "#FF555544",
            borderRadius: 10,
          }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.title}>ログアウト</Text>
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
    textAlign: "center",
    color: "#FF5555cc",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
