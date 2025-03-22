import * as React from "react";
import { StyleSheet, View, FlatList, ListRenderItem, Text,KeyboardAvoidingView,Platform,Button, TextInput,Keyboard,TouchableWithoutFeedback, TouchableOpacity,SafeAreaView } from "react-native";
import { useEffect,useState } from "react";
import { useLocalSearchParams } from "expo-router";
import * as CommentTools from '@/app/lib/comment';
import SimpleInputComponent from "../components/inputComponents";
import {
  AudioSession,
  LiveKitRoom,
  useTracks,
  TrackReferenceOrPlaceholder,
  VideoTrack,
  isTrackReference,
  useRoomContext,
  useLiveKitRoom
} from "@livekit/react-native";
import { Track,RemoteVideoTrack } from "livekit-client";
import Feather from '@expo/vector-icons/Feather';


// !! Note !!
// This sample hardcodes a token which expires in 2 hours.
const wsURL = "wss://progatehackathon-0vilmkur.livekit.cloud";

export default function App() {
  const { token } = useLocalSearchParams();
  // Start the audio session first.
  useEffect(() => {
    let start = async () => {
      await AudioSession.startAudioSession();
    };

    start();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);
  return (
    <LiveKitRoom
      serverUrl={wsURL}
      token={token as string}
      connect={true}
      options={{
        // Use screen pixel density to handle screens with differing densities.
        adaptiveStream: { pixelDensity: "screen" },
      }}
      audio={true}
      video={true}
    >
      <RoomView />
    </LiveKitRoom>
  );
}

const RoomView = () => {
  // Get all camera tracks.
  const room = useRoomContext();
  const [ comment, setComment ] = useState("");
  const tracks = useTracks([RemoteVideoTrack.Source.Camera]);

  const renderTrack: ListRenderItem<TrackReferenceOrPlaceholder> = ({
    item,
  }) => {
    // Render using the VideoTrack component.
    if (isTrackReference(item)) {
      return (
        <VideoTrack
          trackRef={item}
          style={styles.participantView}
          mirror={true}
        />
      );
    } else {
      return <View style={styles.participantView} />;
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
    <SafeAreaView
      style={{ flex: 1 }}
    >
      <FlatList data={tracks} renderItem={renderTrack} />
      <KeyboardAvoidingView
        style={styles.footer}
      >
        <View style={styles.fixedFooter}>
          <View style={{width:"80%"}}>
                <TextInput
                  onChangeText={(t) => {
                    setComment(t);
                  }}
                  style={{
                    height: 40,
                    width: "100%",
                    borderColor: "brack",
                    borderWidth: 0.5,
                    borderRadius: 50,
                    marginBottom: 15,
                    paddingHorizontal: 10,
                  }}
                />
          </View>
          <TouchableOpacity>
            <Feather name="arrow-up-circle" size={40} color={"#000000"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
  },
  participantView: {
    flex: 1,
    aspectRatio: 0.5,
  },
  input: {
    width: '90%',
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  footer: {
    justifyContent: 'flex-end',
    position:"fixed"
  },
  fixedFooter: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row', // 要素を横並びに配置
    justifyContent: 'space-between',
    marginBottom:30
  },
  button: {
    padding: 10, // ボタンのタッチ領域を広げる
    borderRadius: 50, // 丸いボタンを作成する場合
  },
});

