import { useEffect } from "react";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { AuthProvider } from "./lib/auth-context";
import { testConnection } from "./lib/config";
import { LoadingProvider } from "./lib/load-context";
import LoadingIndicator from "./components/LoadingIndicator";
import { StopPointsProvider } from "./context/StopPointsContext";
import Toast from "react-native-toast-message";
import { toastWrapper } from "./components/toast-config";

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    "Montserrat-Black": require("../assets/fonts/Montserrat-Black.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-BoldItalic": require("../assets/fonts/Montserrat-BoldItalic.ttf"),
    "Montserrat-ExtraBold": require("../assets/fonts/Montserrat-ExtraBold.ttf"),
    "Montserrat-Italic": require("../assets/fonts/Montserrat-Italic.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Thin": require("../assets/fonts/Montserrat-Thin.ttf"),
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }

    testConnection();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <LoadingProvider>
      <AuthProvider>
        <StopPointsProvider>
          <LoadingIndicator />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen 
              name="/(root)/latest/new-post"
              options={{ presentation: 'modal' }} 
            />
          </Stack>
          <Toast config={toastWrapper} />
        </StopPointsProvider>
      </AuthProvider>
    </LoadingProvider>
  )
}
