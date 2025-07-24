import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";

import { StripeProvider } from "@stripe/stripe-react-native";

import { Provider } from "react-redux";
import store from "@/store";
import { AuthProvider, NotificationProvider, LoaderProvider, WebSocketProvider } from "@/context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { messaging, getToken, isSupported } from '@/utils/firebaseConfig';
import { useEffect } from "react";


import * as SplashScreen from 'expo-splash-screen';
import { Redirect } from 'expo-router';
import { useFonts } from 'expo-font';


const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});


const Layout = () => {


  const [loadedFont] = useFonts({
      'Urbanist-Bold': require('@/assets/fonts/Urbanist/Urbanist-Bold.ttf'),
      'Urbanist-SemiBold': require('@/assets/fonts/Urbanist/Urbanist-SemiBold.ttf'),
      'Urbanist-Regular': require('@/assets/fonts/Urbanist/Urbanist-Regular.ttf'),
      'Urbanist-Medium': require('@/assets/fonts/Urbanist/Urbanist-Medium.ttf'),
      'RRIcon': require('@/assets/fonts/RRIcons.ttf'),
  });
 
    useEffect(() => {
        if (loadedFont) {
            console.log("indextotot loadedFont")
            SplashScreen.hideAsync();
        }
    }, [loadedFont]);

    if (!loadedFont) return null;

  return (
   
    <Provider store={store}>
      <WebSocketProvider>
        <LoaderProvider>
          {/* <StripeProvider
            urlScheme="restorouen://dashboard"
            publishableKey="pk_test_51QTnm7Hle0NLQ6Q2fnn57wOiJ4Lira79HGHlvBkaPAUWu7nuyIIWphz4Xw8OzyK99DikfbX9y4X8sePtsk6p3pS70091LUiE0E"
            merchantIdentifier="merchant.com.resorouen"
          > */}
            <AuthProvider>
              <NotificationProvider>
                <GestureHandlerRootView style={styles.gestureHandlerRootView}>
                  <ThemeProvider value={MyTheme}>
                  
                    <Stack
                      screenOptions={{
                        contentStyle: { backgroundColor: "#99314d" },
                        headerShown: false, // Pas d'en-tête
                        animation: "slide_from_right", // Animation lors de la transition
                      }}
                    >
                       <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    </Stack>
                  </ThemeProvider>
                </GestureHandlerRootView>
              </NotificationProvider>
            </AuthProvider>
          {/* </StripeProvider> */}
        </LoaderProvider>
      </WebSocketProvider>
    </Provider>
  );
};

export default Layout;

const styles = StyleSheet.create({
  gestureHandlerRootView: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
