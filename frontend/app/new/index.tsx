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
import SimpleInputComponent from "../components/inputComponents";
import * as RoomUtils from "@/app/lib/room";

export default function NewUserScreen() {
  const navigate = useRouter();
  const [titleName, setTitleName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={{ height: "100%", width: "100%" }}>
        <DefaultHeader
          title="配信の作成"
          showSettingButton={true}
          showBackButton={true}
        />
        <View style={styles.container}>
          <SimpleInputComponent title="タイトル" textChange={setTitleName} />
          <SimpleInputComponent title="説明" textChange={setDescription} />
          <SimpleInputComponent title="タグ" textChange={setTags} />
          <TouchableOpacity
            onPress={async () => {
              const session = await fetchAuthSession();
              console.log("OK");
              const res = await RoomUtils.create_room(
                session.tokens?.idToken?.toString()!,
                titleName,
                description,
                "",
              );
              console.log(res);
              if (res) {
                navigate.navigate(`/publisher/${res.token}`);
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
