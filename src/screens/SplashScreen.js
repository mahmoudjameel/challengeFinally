import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Linking } from "react-native";
import * as Animatable from "react-native-animatable";
import * as Notifications from "expo-notifications";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Fire from "../Api/Fire";
import firebase from "firebase/app";
import { registerForPushNotificationsAsync } from "../util/extraMethods";
import I18n from '../screens/Translation/I18n';

const SplashScreen = ({ navigation }) => {
  const notificationListener = useRef();
  const responseListener = useRef();

  //Check if user is logged in or not
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) return;
        if (!user.emailVerified)
          return alert(I18n.t('Theemailverifiedaccount'));

        try {
          //register token for push notifications
          const token = await registerForPushNotificationsAsync();
          const u = await Fire.getUser(user.uid);

          if (u.subscriptionEnd) {
            if (u.subscriptionEnd.toDate().getTime() <= new Date().getTime()) {
              await Fire.updateUser(u.uid, { subscription: "Bronze" });
            }
          }

          //update push token for user
          if (token) await Fire.updateUser(u.uid, { token: token });

          //go to main screen
          navigation.reset({ index: 0, routes: [{ name: u.type == "Admin" ? "Admin" : "DrawerContent" }] });
        } catch (error) {
          alert(error.message);
        }
      });
    }

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      let { origin, data } = notification;
      if (origin === "selected") navigation.navigate(I18n.t('privatechat'));
    });
    
    // This listener is fired whenever a user taps on or interacts with a notification
    // (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
      navigation.navigate(I18n.t('privatechat'));
    });

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
      Notifications.removeNotificationSubscription(notificationListener.current);
      mounted = false;
    };
  }, []);

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <View style={styles.header}>
        <Animatable.Image
          animation="bounceIn"
          duraton="1500"
          source={require("../../assets/cheering.png")}
          style={styles.logo}
          resizeMode="stretch"
        />
      </View>
      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <TouchableOpacity onPress={ ()=>{ Linking.openURL('https://instagram.com/challenge.2022_?utm_medium=copy_link')}} >
        <Text style={styles.title}>{I18n.t('Enjoythebestsportsexperience')}
        <Text style={{color:'red'}}>{I18n.t('Here')}</Text>
         </Text>
         </TouchableOpacity>
        <Text style={styles.text}>{I18n.t('Loginwithyouraccountnow')}</Text>
        <View style={styles.button}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <LinearGradient
              colors={["#02aab0", "#00cdac"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.signIn}
            >
              <Text style={styles.textSign}>{I18n.t('startnow')}</Text>
              <MaterialIcons name="navigate-next" color="#fff" size={20} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </LinearGradient>
  );
};

export default SplashScreen;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 2.5,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 1,
    elevation: 25,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
    backgroundColor: "#F2F2F2",
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  title: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom:5
  },
  text: {
    color: "grey",
    marginTop: 5,
  },
  button: {
    alignItems: "flex-end",
    marginTop: 30,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    flexDirection: "row",
  },
  textSign: {
    color: "white",
    fontWeight: "bold",
  },
});
