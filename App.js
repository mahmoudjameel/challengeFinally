import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Image, StatusBar, LogBox, I18nManager, View, Dimensions } from "react-native";
import { Asset } from "expo-asset";
import Login from "./src/screens/Auth/Login";
import SignUp from "./src/screens/Auth/SignUp";
import Forgot from "./src/screens/Auth/Forgot";
import lang from "./src/screens/Settings/lang";
import Subscriptionfeatures from "./src/screens/Subscriptionfeatures";
import gold from "./src/screens/gold";
import bronze from "./src/screens/bronze";
import silver from "./src/screens/silver";
import MainScreen from "./src/screens/MainScreen";
import FriendsFavorite from "./src/screens/FriendsFavoriteStack";
import Admin from "./src/screens/Admin/AdminTab";
import SplashScreen from "./src/screens/SplashScreen";
import { LinearGradient } from "expo-linear-gradient";
import { setUpNotificationHandler } from "./src/util/extraMethods";

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

// import all used images
const images = [
  require("./assets/icon.png"),
  require("./assets/cheering.png"),
  require("./assets/background.jpg"),
  require("./assets/wheelStop.png"),
  require("./assets/wheelGo.gif"),
];

const RootStack = createStackNavigator();

//setup notification handler
setUpNotificationHandler();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    //Disable rtl
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  }, []);

  const handleResourcesAsync = async () => {
    // we're caching all the images
    // for better performance on the app
    try {
      const cacheImages = images.map((image) => {
        return Asset.fromModule(image).downloadAsync();
      });

      await Promise.all(cacheImages);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsReady(true);
    }
  };

  if (!isReady) {
    return (
      <LinearGradient
        colors={["#2b5876", "#4e4376"]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#172027" }}
      >
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <Image source={require("./assets/Loadings.gif")} onLoad={handleResourcesAsync} />
      </LinearGradient>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar hidden />
      <RootStack.Navigator headerMode="none">
        <RootStack.Screen name="SplashScreen" component={SplashScreen} />
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="SignUp" component={SignUp} />
        <RootStack.Screen name="Forgot" component={Forgot} />
        <RootStack.Screen name="DrawerContent" component={MainScreen} />
        <RootStack.Screen name="FriendsFavorite" component={FriendsFavorite} />
        <RootStack.Screen name="Admin" component={Admin} />
        <RootStack.Screen name="lang" component={lang} />
        <RootStack.Screen name="Subscriptionfeatures" component={Subscriptionfeatures} />
        <RootStack.Screen name="gold" component={gold} />
        <RootStack.Screen name="silver" component={silver} />
        <RootStack.Screen name="bronze" component={bronze} />


      </RootStack.Navigator>
    </NavigationContainer>

  );
}
