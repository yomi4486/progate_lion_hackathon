import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { use, useEffect,useState } from "react";
import "react-native-reanimated";
import { registerGlobals } from "@livekit/react-native";

import { useColorScheme } from "@/components/useColorScheme";

import { Authenticator } from "@aws-amplify/ui-react-native";
import { Amplify } from "aws-amplify";
import awsconfig from "../src/aws-exports.js";
import { fetchAuthSession } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useRouter } from "expo-router";
import * as UserTool from "@/app/lib/user"
import { View,Text } from "react-native";

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
  const [isNewUser, setNewUser] = useState(false);
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  Hub.listen('auth', async (data) => {
    const { payload } = data;
    if (payload.event === 'signedIn'&&!isLoaded) {
      isLoaded = true;
      console.log('User signed in');
      const session = await fetchAuthSession();
      try{
        const res = await UserTool.get(session.userSub!, session.tokens?.idToken?.toString()!);
        if (res == null){
          setNewUser(true)
        } 
        
      }catch(e){  
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

  return <RootLayoutNav isNewUser={isNewUser}/>;
}

function RootLayoutNav({isNewUser}: {isNewUser: boolean}) {
  const colorScheme = useColorScheme();
  const navigate = useRouter();
  if(isNewUser){
    try{
      navigate.push("/new_user");
    }catch(e){
      
    }

  }
  return (
    <Authenticator.Provider>
      <Authenticator>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", headerShown: false }}
            />
          </Stack>
        </ThemeProvider>
      </Authenticator>
    </Authenticator.Provider>
  );
}
