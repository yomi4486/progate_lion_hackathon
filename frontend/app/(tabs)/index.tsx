import { StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { Auth } from 'aws-amplify';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await Auth.signIn('username', 'password');
      router.push('/home'); // Replace '/AnotherScreen' with your target screen path
    } catch (error) {
      console.log('Error signing in', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
