import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Text, View } from "@/components/Themed";
import DefaultHeader from "../components/DefaultHeader";
import { useRouter } from "expo-router";
import * as UserUtils from "@/app/lib/user";
import { fetchAuthSession } from "aws-amplify/auth";
import { useState } from "react";

export default function NewUserScreen() {
  const navigate = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={{ height: "100%" }}>
        <DefaultHeader title="新規ユーザー作成" showSettingButton={true} />
        <View style={styles.container}>
          <Text
            style={{
              textAlign: "left",
              width: "80%",
              fontWeight: "bold",
              fontSize: 20,
              paddingBottom: 5,
            }}
          >
            名前
          </Text>
          <TextInput
            onChangeText={(t) => {
              setDisplayName(t);
            }}
            style={{
              height: 40,
              width: "80%",
              borderColor: "brack",
              borderWidth: 0.5,
              borderRadius: 3,
            }}
          />
          <Text
            style={{
              textAlign: "left",
              width: "80%",
              fontWeight: "bold",
              fontSize: 20,
              paddingBottom: 5,
            }}
          >
            自己紹介
          </Text>
          <TextInput
            onChangeText={(t) => {
              setDescription(t);
            }}
            style={{
              height: 40,
              width: "80%",
              borderColor: "brack",
              borderWidth: 0.5,
              borderRadius: 3,
            }}
          />
          <TouchableOpacity
            onPress={async () => {
              const session = await fetchAuthSession();
              console.log("OK");
              const res = await UserUtils.setMyProfile(
                session.tokens?.idToken?.toString()!,
                displayName,
                "",
                description,
              );
              console.log(res);
              if (res) {
                navigate.navigate("/");
              }
            }}
            style={{
              alignContent: "flex-end",
              alignItems: "flex-end",
              width: "80%",
            }}
          >
            <View
              style={{
                backgroundColor: "#55FF5555",
                borderRadius: 10,
                padding: 10,
                width: "40%",
                marginTop: 10,
              }}
            >
              <Text style={styles.title}>作成</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
