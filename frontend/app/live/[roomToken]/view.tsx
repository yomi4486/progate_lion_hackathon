import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function PostDetails() {
    const { roomToken } = useLocalSearchParams();
    return (
        <View>
            <Text>token:{roomToken}</Text>
        </View>
    );
}
