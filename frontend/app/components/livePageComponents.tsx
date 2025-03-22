import React from "react";
import { View, Text } from "react-native";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "react-native";
import Logo from '../images/logo.png'

interface LivePageProps {
  title: string;
  thumbnail: boolean;
  showBackButton?: boolean; /// 任意プロパティ
}

const LivePage: React.FC<LivePageProps> = ({
  title,
  thumbnail,
  showBackButton = false,
}) => {
  const router = useRouter();
  return (
    <View style={{}}>
        <Image
            source={Logo}
            style={styles.logo}
        />
    </View>
  );
};

export default LivePage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100, // 画像の幅
        height: 100, // 画像の高さ
        resizeMode: 'contain', // 画像のリサイズ方法（例: contain, cover など）
    },
});