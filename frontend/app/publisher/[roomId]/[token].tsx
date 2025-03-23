import * as React from "react";
import { StyleSheet, View, FlatList, ListRenderItem, Text,KeyboardAvoidingView,Platform,Button, TextInput,Keyboard,TouchableWithoutFeedback, TouchableOpacity,SafeAreaView } from "react-native";
import { useEffect,useState } from "react";
import { useLocalSearchParams } from "expo-router";
import * as CommentTools from '@/app/lib/comment';

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
import { fetchAuthSession } from "aws-amplify/auth";
import { AppType } from "../../../../backend/src";
const { hc } = require("hono/dist/client") as typeof import("hono/client");
import type { InferRequestType, InferResponseType } from "hono/client";
const client = hc<AppType>(process.env.EXPO_PUBLIC_BASE_URL!);



// !! Note !!
// This sample hardcodes a token which expires in 2 hours.
const wsURL = "wss://progatehackathon-0vilmkur.livekit.cloud";

export default function App() {
  const { roomId,token } = useLocalSearchParams();
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
      <RoomView roomId={roomId as string} />
    </LiveKitRoom>
  );
}

const RoomView = ({roomId}:{roomId:string}) => {
  // Get all camera tracks.
  const room = useRoomContext();
  const [ comment, setComment ] = useState("");
  const roomIdFromGet = client.comments[":roomId"];
  const [ comments, setComments ] = useState<InferResponseType<typeof roomIdFromGet.$get, 200>>({comments:[]});
  const tracks = useTracks([RemoteVideoTrack.Source.Camera]);

  setInterval(()=>{
    const data = async()=>{
      const session = await fetchAuthSession();
      const res = await CommentTools.getComment(session.tokens?.idToken?.toString()!,roomId);
      console.log(res)
      if(res?.comments != undefined)setComments(res?.comments);
    }
    data();
  },1000)

  useEffect(()=>{},[comments]);
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
      <View style={{position:"absolute"}}>
      <FlatList
      data={comments.comments}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.commentContainer}>
          <Text style={styles.commentText}>{item["comment"]}</Text>
        </View>
      )}
      />
      </View>
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
          <TouchableOpacity onPress={async()=>{
            const session = await fetchAuthSession();
            CommentTools.createCommnet(session.tokens?.idToken?.toString()!,comment,0,roomId)
          }}>
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
  commentContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  commentText: {
    fontSize: 16,
  },
});

