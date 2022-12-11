import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, ActivityIndicator, FlatList, TextInput, TouchableOpacity } from "react-native";
import Fire from "../Api/Fire";
import StoreCard from "./StoreCard";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import firebase from "firebase/app";
import ModalSelector from "react-native-modal-selector";
import { convertArabicNumbers, displayMessage, sendPushNotification } from "../util/extraMethods";
import Dialog, {
  DialogFooter,
  DialogButton,
  SlideAnimation,
  DialogContent,
  DialogTitle,
} from "react-native-popup-dialog";
import I18n from '../screens/Translation/I18n';

const { height, width } = Dimensions.get("screen");

export const SendGiftDialog = ({ otheruser, visible, onPressOutside }) => {
  const [loading, setLoading] = useState(false);
  const [gifts, setGifts] = useState([]);
  const [ballsType, setType] = useState("Silver");
  const [balls, setBalls] = useState("0");
  const [ballsPoints, setBallsPoints] = useState(40);
  const [user, setUser] = useState({});

  //Get Balls & Gifts Store list
  useEffect(() => {
    let mounted = true;

    const userSubscription = Fire.observeUser(Fire.uid, (user) => {
      if (mounted) setUser(user);

      (async () => {
        const balls = await Fire.getAllBalls(user.subscription);
        if (mounted) setBallsPoints(parseInt(balls.transferBalls) || 40);
      })();
    });

    if (mounted) getUserItems();

    return () => {
      mounted = false;
      userSubscription ? userSubscription() : null;
    };
  }, []);

  //get user items
  const getUserItems = async () => {
    const items = await Fire.getUserItems(Fire.uid);
    setGifts(items);
  };

  //Send gift to the other user
  const sendGift = async (item, type) => {
    try {
      setLoading((prev) => true);
      if (type == 1) {
        let b = convertArabicNumbers(balls);
        let bAfter = ((ballsPoints / 100) * b).toFixed(0);

        if (b == 0) return setLoading((prev) => false);

        if (ballsType == "Silver") {
          if (user.silverBalls < convertArabicNumbers(b)) {
            displayMessage(I18n.t('Youdonhaveenoughballs'));
            setLoading((prev) => false);
            return;
          }
          const res = await Fire.updateUser(otheruser.uid, {
            silverBalls: firebase.firestore.FieldValue.increment(parseInt(bAfter)),
          });

          if (!res) {
            displayMessage(I18n.t('occurredpleasetryagainlater'));
            setLoading((prev) => false);
            return;
          }

          const res2 = await Fire.updateUser(Fire.uid, {
            silverBalls: firebase.firestore.FieldValue.increment(-parseInt(b)),
          });

          if (!res2) {
            displayMessage(I18n.t('occurredpleasetryagainlater'));
            setLoading((prev) => false);
            return;
          }

          //send notification
          sendPushNotification(
            otheruser.token,
            `${I18n.t('messagefrom')} ${user.username || I18n.t('Anonymous')} `, 
            ` ${I18n.t('Ihavesentyou')}${bAfter} ${I18n.t('silverball')}`, 
            ""
          );
        } else {
          if (user.goldBalls < convertArabicNumbers(b)) {
            displayMessage(I18n.t('Youdonhaveenoughballs'));
            setLoading((prev) => false);
            return;
          }
          const res = await Fire.updateUser(otheruser.uid, {
            goldBalls: firebase.firestore.FieldValue.increment(parseInt(bAfter)),
          });

          if (!res) {
            displayMessage(I18n.t('occurredpleasetryagainlater'));
            setLoading((prev) => false);
            return;
          }

          const res2 = await Fire.updateUser(Fire.uid, {
            goldBalls: firebase.firestore.FieldValue.increment(-parseInt(b)),
          });

          if (!res2) {
            displayMessage(I18n.t('occurredpleasetryagainlater'));
            setLoading((prev) => false);
            return;
          }

          //send notification
          sendPushNotification(
            otheruser.token,
            `${I18n.t('messagefrom')} ${user.username || I18n.t('Anonymous')} `,
            ` ${I18n.t('Ihavesentyou')}${bAfter} ${I18n.t('goldenball')}`, 
            ""
          );
        }
      } else {
        let i = {
          ...item,
          amount: 1,
          price: item.price / 2,
          user: { uid: user.uid, username: user.username, image: user.image, email: user.email },
        };

        //send item to the reciever user
        const res = await Fire.addToUserItems(otheruser.uid, i, false);

        if (!res) {
          displayMessage(I18n.t('occurredpleasetryagainlater'));
          setLoading((prev) => false);
          return;
        }

        //delete item from the sender user
        const response = await Fire.deleteFromUserItems(user.uid, `${item.uid}-${item.user.uid}`);

        if (!response) {
          displayMessage(I18n.t('occurredpleasetryagainlater'));
          setLoading((prev) => false);
          return;
        }

        //send notification
        sendPushNotification(otheruser.token, `${I18n.t('messagefrom')} ${user.username || I18n.t('Anonymous')} `, `${I18n.t('Ihavesentyou')} ${I18n.t('gift')}`, "");

        getUserItems();
      }
      setLoading((prev) => false);
      displayMessage(I18n.t('Thegifthasbeeenttotheuser'));
    } catch (error) {
      setLoading((prev) => false);
      displayMessage(error.message);
    }
  };

  const renderGift = ({ item }) => {
    return <StoreCard type={2} itemData={item} onPress={() => sendGift(item, 2)} />;
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <Animatable.View animation="bounceIn" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff", fontSize: 20 }}>{I18n.t('Youhavenoaway')}</Text>
      </Animatable.View>
    );
  };

  const renderLoading = () => {
    if (!loading) return null;
    return (
      <View>
        <ActivityIndicator style={{ marginTop: 20 }} animating color="#fff" size="large" />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 18, color: "gold", padding: 5 }}>{I18n.t('balls')}</Text>
          <Text style={{ fontSize: 18, color: "gold", padding: 5 }}>{I18n.t('yourcurrentballs')}: {user.silverBalls || 0}</Text>
          <Text style={{ fontSize: 18, color: "gold", padding: 5 }}>{I18n.t('Yourcurrengoldenballs')} {user.goldBalls || 0}</Text>
        </View>
        <TextInput
          placeholder={I18n.t('numberofsilverballs')}
          placeholderTextColor={I18n.t('silver')}
          style={{
            marginTop: 20,
            backgroundColor: "transparent",
            color: "#fff",
            borderWidth: 1,
            padding: 10,
            borderColor: "#fff",
            borderRadius: 10,
          }}
          keyboardType="number-pad"
          value={balls}
          onChangeText={(text) => setBalls((prev) => text)}
        />
        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            borderColor: "#fff",
            borderWidth: 1,
            borderRadius: 10,
            padding: 15,
          }}
        >
          <ModalSelector
            initValueTextStyle={{ color: "#000" }}
            style={{ height: 30, width: "100%" }}
            data={[
              { key: 1, label: "Silver" },
              { key: 2, label: "Gold" },
            ]}
            initValue={I18n.t('ChooseType')}
            onChange={(option) => setType(option.label)}
            cancelText={I18n.t('cancel')}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ flex: 1, padding: 5, height: 30, color: "#fff" }}>{ballsType}</Text>
            </View>
          </ModalSelector>
        </View>
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <TouchableOpacity onPress={() => sendGift(balls, 1)}>
            <LinearGradient
              colors={["#02aab0", "#00cdac"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 300,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                elevation: 5,
                paddingHorizontal: 20,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15, alignSelf: "center" }}>{I18n.t('Send')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 18, color: "gold", padding: 5 }}>{I18n.t('gifts')}</Text>
        </View>
      </View>
    );
  };

  return (
    <Dialog
      visible={visible}
      dialogStyle={{ backgroundColor: "#02aab0", width: width / 1.2 }}
      dialogTitle={
        <DialogTitle
          style={{ backgroundColor: "#02aab0" }}
          align={"center"}
          textStyle={{ color: "white" }}
          title={I18n.t('sendgifts')}
        />
      }
      dialogAnimation={new SlideAnimation({ slideFrom: "bottom" })}
      footer={
        <DialogFooter>
          <DialogButton align={"center"} textStyle={{ color: "white" }} text={I18n.t('cancel')}onPress={onPressOutside} />
        </DialogFooter>
      }
      onTouchOutside={onPressOutside}
    >
      <DialogContent style={{ height: height / 2, backgroundColor: "#02aab0" }}>
        {!loading ? (
          <FlatList
            data={gifts}
            renderItem={renderGift}
            ListEmptyComponent={renderEmpty}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderLoading}
            keyExtractor={(item) => item.uid}
            numColumns={2}
          />
        ) : (
          renderLoading()
        )}
      </DialogContent>
    </Dialog>
  );
};
