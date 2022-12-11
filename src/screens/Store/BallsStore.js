import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Modal } from "react-native";
import StoreCard from "../../components/StoreCard";
import { LinearGradient } from "expo-linear-gradient";
import Fire from "../../Api/Fire";
import * as Animatable from "react-native-animatable";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { displayMessage } from "../../util/extraMethods";
import firebase from "firebase/app";
import { WebView } from "react-native-webview";
import PaymentDialog from "../../components/PaymentDialog";
import I18n from '../Translation/I18n';

const BallStore = ({ navigation }) => {
  const [showDialogPayTaps, setshowDialogPayTaps] = useState(false);
  const [showDialogPayPal, setshowDialogPayPal] = useState(false);
  const [visible, setvisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState({});
  const [balls, setBalls] = useState([]);
  const [user, setUser] = useState({});

  //Get Balls Store list
  useEffect(() => {
    let mounted = true;
    let subscriber = Fire.getStoreItems("BallsStore", (items) => {
      if (mounted) {
        setBalls(items);
        setLoading(false);
      }
    });

    getUserDetails();

    return () => {
      subscriber.off();
      mounted = false;
    };
  }, []);

  const getUserDetails = async () => {
    const u = await Fire.getUser(Fire.uid);
    setUser(u);
  };

  //handle Payment
  const handlePayment = async (data) => {
    if (data.title === "success") {
      const res = await Fire.updateUser(Fire.uid, {
        silverBalls: firebase.firestore.FieldValue.increment(parseInt(item.amount)),
      });
      if (res) {
        await Fire.deleteStoreItem("BallsStore", item, false);
        await Fire.addTransaction({
          buyer: { id: user.uid, name: user.username, email: user.email , phoneNumber: user.phoneNumber, city: user.city },
          item: item,
          paid: false,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setshowDialogPayTaps(false);
        setshowDialogPayPal(false);
        setvisible(false);
        displayMessage(I18n.t('Buyingsucceeded'));
        return;
      } else {
        setshowDialogPayTaps(false);
        setshowDialogPayPal(false);
        setvisible(false);
        displayMessage(I18n.t('Errors'));
        return;
      }
    } else if (data.title === "error") {
      setshowDialogPayTaps(false);
      setshowDialogPayPal(false);
      setvisible(false);
      displayMessage(I18n.t('Errors'));
    } else {
      return;
    }
  };

  const openDialog = (item) => {
    setItem(item);
    setvisible(true);
  };

  const renderItem = ({ item }) => {
    return (
      <StoreCard
        type={1}
        itemData={item}
        onPress={() => {
          item.user.uid == Fire.uid
          ? navigation.navigate(I18n.t('typepage'), { itemData: item, type: "BallsStore" })
          : openDialog(item);
        }}
      />
    );
  };

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View style={{ paddingVertical: 20, borderTopWidth: 1, borderColor: "#CED0CE" }}>
        <ActivityIndicator animating color="#fff" size="large" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <Animatable.View animation="bounceIn" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff", fontSize: 30 }}>{I18n.t('Thereisnotype')}</Text>
      </Animatable.View>
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      {user.subscription != "Bronze" ? (
        <View style={styles.button}>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
            onPress={() => navigation.navigate(I18n.t('addtype'))}
          >
            <LinearGradient
              colors={["#02aab0", "#00cdac"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.signIn}
            >
              <Icon name="plus" color="#fff" size={40} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : null}
      <Animatable.View animation="bounceIn">
        <FlatList
          data={balls}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          keyExtractor={(item) => item.uid}
          numColumns={2}
        />
      </Animatable.View>
      <Modal visible={showDialogPayTaps} onRequestClose={() => setshowDialogPayTaps(false)}>
        <WebView
          source={{
            uri: `https://challenge-payment.netlify.app/?first=${user.name}&email=${user.email}&phone=${user.phoneNumber}&amount=${item.price}`,
          }}
          javaScriptEnabled={true}
          useWebKit={true}
          startInLoadingState={true}
          onMessage={(event) => {}}
          onNavigationStateChange={(data) => handlePayment(data)}
          injectedJavaScript={'document.getElementById("openLightBox").click();'}
        />
      </Modal>
      <Modal visible={showDialogPayPal} onRequestClose={() => setshowDialogPayPal(false)}>
        <WebView
          source={{ uri: "https://paypal-pym.herokuapp.com/" }}
          javaScriptEnabled={true}
          onNavigationStateChange={(data) => handlePayment(data)}
          useWebKit={true}
          startInLoadingState={true}
          onMessage={(event) => {}}
          injectedJavaScript={`
        document.getElementById("amount").value = "${(item.price / 3.75).toFixed(2)}";
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
    </LinearGradient>
  );
};

export default BallStore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems:'center' 

},
  button: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  signIn: {
    flexDirection: "row",
    width: "16%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    elevation: 5,
  },
});
