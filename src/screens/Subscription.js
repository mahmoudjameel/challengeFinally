import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Fire from "../Api/Fire";
import firebase from "firebase/app";
import PaymentDialog from "../components/PaymentDialog";
import SubscriptionDialog from "../components/SubscriptionDialog";
import { displayMessage } from "../util/extraMethods";
import { WebView } from "react-native-webview";
import I18n from '../screens/Translation/I18n';


const Subscription = ({navigation}) => {
  const [showDialogPayTaps, setshowDialogPayTaps] = useState(false);
  const [showDialogPayPal, setshowDialogPayPal] = useState(false);
  const [visible, setvisible] = useState(false);
  const [type, setType] = useState("Silver");
  const [price, setprice] = useState({ Silver: 0, Gold: 0 });
  const [user, setUser] = useState({});


  
  useEffect(() => {
    getSubscriptionPrice();
    getUserDetails();
  }, []);

  const getSubscriptionPrice = async () => {
    let silverPrice = await Fire.getAllBalls("Silver");
    let goldPrice = await Fire.getAllBalls("Gold");
    setprice({ Silver: parseInt(silverPrice.price).toFixed(2), Gold: parseInt(goldPrice.price).toFixed(2) });
  };

  const getUserDetails = async () => {
    const u = await Fire.getUser(Fire.uid);
    setUser(u);
  };

  // //handle Subscription
  // const handleSubscription = async (data) => {
  //   if (data.title === "success") {
  //     var future = new Date();
  //     future = new Date(future.setDate(future.getDate() + 30));
  //     const res = await Fire.updateUser(Fire.uid, {
  //       subscription: type,
  //       subscriptionEnd: future,
  //       silverBalls: firebase.firestore.FieldValue.increment(type == "Silver" ? 5000 : 50),
  //       goldBalls: firebase.firestore.FieldValue.increment(type == "Gold" ? 100 : 8000),
  //     });
      
  //     if (res) {
  //       displayMessage(I18n.t('Subscribed'));
  //       setshowDialogPayTaps(false);
  //       setshowDialogPayPal(false);
  //       setvisible(false);
  //       return;
  //     } else {
  //       displayMessage(I18n.t('Anerrorhasoccurrd'));
  //       return;
  //     }
  //   } else if (data.title === "error") {
  //     displayMessage(I18n.t('Errors'));
  //     setshowDialogPayTaps(false);
  //     setshowDialogPayPal(false);
  //     setvisible(false);
  //     return;
  //   } else {
  //     return;
  //   }
  // };
  //handle Subscription
  const handleSubscription = async (data) => {
    if (data.title === "success") {
      var future = new Date();
      future = new Date(future.setDate(future.getDate() + 30));

      let gifts =
        type == "Silver"
          ? {
              silverBalls: firebase.firestore.FieldValue.increment(5000),
              goldBalls: firebase.firestore.FieldValue.increment(50),
            }
          : {
              silverBalls: firebase.firestore.FieldValue.increment(8000),
              goldBalls: firebase.firestore.FieldValue.increment(100),
            };

      const res = await Fire.updateUser(Fire.uid, { subscription: type, subscriptionEnd: future, ...gifts });

      if (res) {
        displayMessage(I18n.t("Subscribed"));
        setshowDialogPayTaps(false);
        setshowDialogPayPal(false);
        setvisible(false);
      } else {
        displayMessage(I18n.t("Anerrorhasoccurrd"));
      }
    } else if (data.title === "error") {
      displayMessage(I18n.t("Errors"));
      setshowDialogPayTaps(false);
      setshowDialogPayPal(false);
      setvisible(false);
    } else {
      return;
    }
  };

  
  return (
    
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={[styles.text, { color: "#fff" }]}>{I18n.t('Choosethetypeofsubscription')}</Text>
        <Text style={[styles.text, { color: "gold" }]}>{I18n.t('Monthlysubscription')}</Text>
      </View>
      <View style={{ flex: 3 }}>
        <View style={styles.button}>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
            onPress={() => {
              setType("Silver");
              setvisible(true);
            }}
          >
            <LinearGradient
              colors={["#bdc3c7", "#D3D3D3"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.signIn}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>{I18n.t('Silversubscription')} : <Text style={{color:'red'}}>3$</Text></Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
            onPress={() => {
              setType("Gold");
              setvisible(true);
            }}
          >
            <LinearGradient
              colors={["#FFD700", "#F0E68C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.signIn}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>{I18n.t('Goldsubscription')} : <Text style={{color:'red'}}>5$</Text></Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
            onPress={() => navigation.navigate('Subscriptionfeatures')}

          >
            <LinearGradient
              colors={["#02aab0", "#00cdac"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.signIn}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}> {I18n.t('Featuresofeachsubscription')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Modal visible={showDialogPayTaps} onRequestClose={() => setshowDialogPayTaps(false)}>
          <WebView
            source={{
              uri: `https://challenge-payment.netlify.app/?first=${user.name}&email=${user.email}&phone=${
                user.phoneNumber
              }&amount=${type == "Silver" ? price.Silver : price.Gold}`,
            }}
            javaScriptEnabled={true}
            onNavigationStateChange={(data) => handleSubscription(data)}
            useWebKit={true}
            startInLoadingState={true}
            onMessage={(event) => {}}
            injectedJavaScript={'document.getElementById("openLightBox").click();'}
          />
        </Modal>
        <Modal visible={showDialogPayPal} onRequestClose={() => setshowDialogPayPal(false)}>
          <WebView
            source={{ uri: "https://paypal-pym.herokuapp.com/" }}
            javaScriptEnabled={true}
            onNavigationStateChange={(data) => handleSubscription(data)}
            useWebKit={true}
            startInLoadingState={true}
            onMessage={(event) => {}}
            injectedJavaScript={`
            document.getElementById("amount").value = "${type == "Silver" ? (price.Silver / 3.75).toFixed(2) : (price.Gold / 3.75).toFixed(2)}";
            document.getElementById("item").value = "${user.name}";
            document.f1.submit();
            `}
          />
        </Modal>
        <PaymentDialog
          visible={visible}
          onTouchOutside={() => setvisible(false)}
          onPressPayPal={() => setshowDialogPayPal(true)}
          onPressPayTaps={() => setshowDialogPayTaps(true)}
        />
           <PaymentDialog
          visible={visible}
          onTouchOutside={() => setvisible(false)}
          onPressPayPal={() => setshowDialogPayPal(true)}
          onPressPayTaps={() => setshowDialogPayTaps(true)}
        />
      </View>
    </LinearGradient>
  );
};

export default Subscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 5,
  },
  action: {
    flexDirection: "row",
    marginTop: 20,
    elevation: 3,
    borderRadius: 10,
    padding: 15,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
  },
  button: {
    alignItems: "center",
    marginTop: 40,
  },
  signIn: {
    flexDirection: "row",
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 5,
  },
});
