import React, { useState, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, Text, TouchableOpacity, Image, AppState, Dimensions , Platform} from "react-native";
import Fire from "../../Api/Fire";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { displayMessage, formatTimeString } from "../../util/extraMethods";
import Dialog, {
  DialogFooter,
  DialogButton,
  SlideAnimation,
  DialogContent,
  DialogTitle,
} from "react-native-popup-dialog";
import I18n from '../../screens/Translation/I18n';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from "expo-ads-admob";

const WheelOfFortune = ({ navigation }) => {
  const [currentTime, setCurrentTime] = useState({ time: 86400000, lastUpdated: new Date().getTime() });
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(require("../../../assets/wheelStop.png"));
  const [user, setUser] = useState({ userId: "", userBalls: 0, showDialog: false });
  const interval = useRef(null);
  const timeout = useRef(null);
  const appState = useRef(AppState.currentState);
  const [isLoading, setIsLoading] = useState(false);
  //Wheel gifts
  const gifts = [40, 5, 1, 20, 1, 1, 30, 1, 10];


const unitIds = Platform.select({
  ios: "ca-app-pub-3882559038076253/6857937918",
  android: "ca-app-pub-3882559038076253/9749918467",
});
let servePersonalizedAds = false;

  

  useEffect(() => {
    AdMobInterstitial.setAdUnitID(unitIds);

    const interstitialListeners = {
      interstitialDidLoad: onInterstitialDidLoad,
      interstitialDidFailToLoad: onInterstitialDidFailToLoad,
      interstitialDidOpen: onInterstitialDidOpen,
      interstitialDidClose: onInterstitialDidClose,
    };

    Object.keys(interstitialListeners).forEach((eventName) =>
      AdMobInterstitial.addEventListener(
        eventName,
        interstitialListeners[eventName]
      )
    );

    return () => {
      AdMobInterstitial.removeAllListeners();
    };
  }, []);

  function onInterstitialDidLoad() {
    console.info("Ad loaded.");

    AdMobInterstitial.showAdAsync();
    setIsLoading(false);
  }

  function onInterstitialDidFailToLoad(error) {
    console.info("Ad failed to load:", error);

    setIsLoading(false);
  }

  function onInterstitialDidOpen() {
    console.info("Ad opened.");
  }

  function onInterstitialDidClose() {
    console.info("Ad closed.");
  }






  useEffect(() => {
    (async () => {
      const user = await Fire.getUser(Fire.uid);
      setUser({ userBalls: user.silverBalls, userId: user.uid, showDialog: user.regGift || false });
    })();

    return () => {
      clearInterval(interval.current);
      clearTimeout(timeout.current);
    };
  }, []);

  //check if screen is active to resume the timer
  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    return () => AppState.removeEventListener("change", handleAppStateChange);
  }, [currentTime]);

  //check if screen is active to resume the timer
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      if (!navigation.isFocused()) return;
      await resumeTimer();
    });
    return unsubscribe;
  }, [navigation, currentTime]);

  //check if screen is inactive to save the timer
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", async () => {
      await saveTimer();
    });
    return unsubscribe;
  }, [navigation, currentTime]);

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState.match(/inactive|background/)) {
      await saveTimer();
    } else if (appState.current.match(/inactive|background/) && nextAppState === "active") {
      await resumeTimer();
    }
    appState.current = nextAppState;
  };
const unitId = Platform.select({
  ios: "ca-app-pub-3882559038076253/6203393185",
  android: "ca-app-pub-3882559038076253/3376081808",
});
  const startTime = (currentTime) => {
    let date = new Date();
    let diff = date.getTime() - currentTime.lastUpdated;
    const endTime = date.getTime() + currentTime.time - (currentTime.time !== 86400000 ? diff : 0);
    interval.current = setInterval(() => {
      setCurrentTime((prev) => {
        const remaining = endTime - new Date();
        if (remaining <= 1000) return resetTimer();
        return { ...prev, time: remaining };
      });
    }, 1);
  };

  const resumeTimer = async () => {
    const data = await AsyncStorage.getItem("timer");
    if (!data) return;
    const timer = JSON.parse(data);
    if (!timer) return;
    setCurrentTime((prev) => timer);
    startTime(timer);
  };

  const saveTimer = async () => {
    await AsyncStorage.setItem("timer", JSON.stringify({ time: currentTime.time, lastUpdated: new Date().getTime() }));
    clearInterval(interval.current);
    clearTimeout(timeout.current);
  };

  const resetTimer = async () => {
    await AsyncStorage.removeItem("timer");
    setCurrentTime({ time: 86400000, lastUpdated: new Date().getTime() });
    clearInterval(interval.current);
    clearTimeout(timeout.current);
  };

  //add balls to user
  const giveUser = async () => {
    const response = await Fire.updateUser(user.userId, { regGift: false });
    if (response) setUser({ ...user, showDialog: false });
  };

  //Start loading wheel gif and count prize




  const startWheel = () => {
    if (user.userBalls < 5) return displayMessage(I18n.t('Youdonhaveenoughballs'));

    setImage((prev) => require("../../../assets/wheelGo.gif"));
    setMessage((prev) => "");

    if (!isLoading) {
      setIsLoading(true);
      AdMobInterstitial.requestAdAsync({
        servePersonalizedAds,
      }).catch((err) => console.info("err: ", err));
    }
    //Wait for 3 seconds
    timeout.current = setTimeout(async () => {
      let gift = gifts[Math.floor(Math.random() * gifts.length)]; //Calculate gift prize
      let userSilverBalls = user.userBalls - 5;
      await Fire.updateUser(user.userId, { silverBalls: userSilverBalls + gift }); //Update User silver Balls
      stopWheel(gift);
    }, 3000);

    
    

  };

  //Stop loading wheel gif
  const stopWheel = (gift) => {
    setMessage((prev) => gift || "0");
    setImage((prev) => require("../../../assets/wheelStop.png"));
    startTime(currentTime);
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
            
      <Text style={styles.bold}>{I18n.t('Tryyourluckfor5silverballs')}</Text>
      <View style={{ alignItems: "center" }}>
        <Image source={image} style={styles.wheel} />
        {!message ? null : <Text style={styles.bold}> {I18n.t('Youhavewon')} {message} {I18n.t('silverball')}  </Text>}
      </View>
      {currentTime.time !== 86400000 ? (
        <View style={styles.timer}>
          <Text style={styles.text}>{formatTimeString(currentTime.time, false)}</Text>
          <View
            style={{
              width: Dimensions.get("window").width,
              paddingLeft:50,
              paddingTop:20,
              alignItems:'center'

            }}
          >
            <PublisherBanner
              bannerSize="banner"
              adUnitID={unitId}
              
              style={{
                width: Dimensions.get("window").width,
              }}
            />
          </View>
        </View>
        
      ) : (
        <TouchableOpacity style={styles.button} onPress={startWheel}     activeOpacity={1}
        >
          <LinearGradient
            colors={["#02aab0", "#00cdac"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.linearGradient}
          >
            <Text style={styles.bold}>{I18n.t('start')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <Dialog
        visible={user.showDialog}
        dialogStyle={{ backgroundColor: "#02aab0" }}
        dialogTitle={
          <DialogTitle
            style={{ backgroundColor: "#02aab0" }}
            align="center"
            textStyle={{ color: "white" }}
            title={I18n.t('Youwonanaward')}
                      />
        }
        onHardwareBackPress={giveUser}
        dialogAnimation={new SlideAnimation({ slideFrom: "bottom" })}
        footer={
          <DialogFooter>
            <DialogButton
              key="confirm"
              align={"center"}
              textStyle={{ color: "white" }}
              text={I18n.t('Submit')}
              onPress={giveUser}
            />
          </DialogFooter>
        }
      >
        <DialogContent style={styles.content}>
          <Icon style={{ margin: 20 }} name="soccer" color="#000" size={50} />
          <Text> {I18n.t('Iwon')}  {user.userBalls} {I18n.t('GiftballRegisterouraccountyouarewelcome')}</Text>
        </DialogContent>
      </Dialog>
      

    </LinearGradient>
    
  );
  
};


export default WheelOfFortune;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
  },
  wheel: {
    height: 300,
    width: 300,
  },
  bold: {
    fontSize: 20,
    color: "#fff",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  linearGradient: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    borderRadius: 10,
    padding: 15,
  },
  content: {
    backgroundColor: "#02aab0",
    justifyContent: "center",
    alignItems: "center",
  },
  timer: {
    padding: 5,
    borderRadius: 5,
    width: 150,
    alignItems:'center',
  },
  text: {
    fontSize: 30,
    color: "#FFF",
    marginLeft: 7,
    backgroundColor: "#000",

  },
});
