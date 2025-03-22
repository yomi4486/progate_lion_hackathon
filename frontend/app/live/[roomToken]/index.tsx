import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { LiveKitRoom } from '@livekit/react-native';

export default function PostDetails() {
    const { roomToken } = useLocalSearchParams();
    console.log(roomToken as string);
    return (
        <View>
            <LiveKitRoom
                serverUrl="wss://progatehackathon-0vilmkur.livekit.cloud"
                token={roomToken as string}
                connect={true}
                audio={true}
            >
            </LiveKitRoom>
        </View>
    );
}
