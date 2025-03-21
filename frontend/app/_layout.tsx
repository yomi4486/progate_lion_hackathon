import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { registerGlobals } from "@livekit/react-native";
import { StyleSheet } from "react-native";
import { useColorScheme } from "@/components/useColorScheme";
import { Hub } from "aws-amplify/utils";

import { Authenticator } from "@aws-amplify/ui-react-native";
import { Amplify } from "aws-amplify";
import awsconfig from "../src/aws-exports.js";
import { fetchAuthSession } from "aws-amplify/auth";
import { useRouter } from "expo-router";
import * as UserTool from "@/app/lib/user";
import { View,Text } from "react-native";
import DefaultRootLayoutNav, { NewUserRootLayoutNav } from "@/app/root";

let isLoaded: boolean = false;

Amplify.configure(awsconfig);
registerGlobals();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isNewUser, setNewUser] = useState<boolean|undefined>(undefined);
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    const data = async() => {
      isLoaded = true;
      const session = await fetchAuthSession();
      try {
        const res = await UserTool.get(
          session.userSub!,
          session.tokens?.idToken?.toString()!,
        );
        console.log(res)
        if (res == null) {
          setNewUser(true);
        }else{
          setNewUser(false);
        }
      } catch (e) {
        console.error(e);
        return;
      }
    }
    data();
  },[]);

  Hub.listen("auth", async(data) => {
    if (data.payload.event === "signedIn") { 
      console.log("OK")
      setNewUser(undefined);
      const session = await fetchAuthSession();
      try {
        const res = await UserTool.get(
          session.userSub!,
          session.tokens?.idToken?.toString()!,
        );
        console.log(res)
        if (res == null) {
          setNewUser(true);
        }else{
          setNewUser(false);
        }
      } catch (e) {
        console.error(e);
        return;
      }
    }
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav isNewUser={isNewUser} />;
}

function RootLayoutNav({ isNewUser }: { isNewUser: boolean|undefined }) {
  const colorScheme = useColorScheme();
  const navigate = useRouter();
  console.log(isNewUser)
  if (isNewUser === undefined) {
    return (
      <Authenticator.Provider>
      <Authenticator loginMechanisms={["email"]} socialProviders={["google","apple","amazon"]}>
        <View style={styles.container}>
          <Text>ローディング中</Text>
        </View>
      </Authenticator>
      </Authenticator.Provider>
    );
  }else if(isNewUser == true){
    return (
      <Authenticator.Provider>
        <Authenticator loginMechanisms={["email"]} socialProviders={["google","apple","amazon"]}>
          <NewUserRootLayoutNav />
        </Authenticator>
      </Authenticator.Provider>
    );
  }else if(isNewUser == false){
    return(
    <Authenticator.Provider>
      <Authenticator loginMechanisms={["email"]} socialProviders={["google","apple","amazon"]}>
        <DefaultRootLayoutNav />
      </Authenticator>
    </Authenticator.Provider>
    );
  }else{
    return (
      <Authenticator.Provider>
      <Authenticator loginMechanisms={["email"]} socialProviders={["google","apple","amazon"]}>
        <View style={styles.container}>
          <Text>ローディング中</Text>
        </View>
      </Authenticator>
      </Authenticator.Provider>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
});