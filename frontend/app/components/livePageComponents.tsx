import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "react-native";
import Thumbnail from "../images/thumbnail.png";

interface LivePageProps {
  title: string;
  description?: string;
  ownerName: string;
  thumbnail: boolean;
  roomId: string;
}

const LivePage: React.FC<LivePageProps> = ({
  title,
  thumbnail,
  ownerName,
  description,
  roomId,
}) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        router.push(`../live/${roomId}`);
      }}
    >
      <Image source={Thumbnail} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{ownerName}</Text>
    </TouchableOpacity>
  );
};

export default LivePage;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10, // 角を丸くする
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    padding: 16, // 余白を設定
    shadowColor: "#000", // シャドウの色
    shadowOffset: { width: 0, height: 4 }, // シャドウの位置
    shadowOpacity: 0.3, // シャドウの透明度
    shadowRadius: 4, // シャドウのぼかし
    // Android用シャドウ
    elevation: 5, // 高さ（シャドウの強さに影響）
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    width: "100%", // 画像の横幅を親要素に合わせる
    height: undefined, // 自動調整のためにundefinedを設定
    aspectRatio: 16 / 9, // アスペクト比を16:9に設定
    borderRadius: 10, // 画像の角を丸くする
  },
  title: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
    paddingHorizontal: 4, // テキストの左右マージンを設定
  },
  description: {
    marginTop: 6,
    fontSize: 16,
    color: "#666",
    textAlign: "left",
    paddingHorizontal: 4, // テキストの左右マージンを設定
  },
});
