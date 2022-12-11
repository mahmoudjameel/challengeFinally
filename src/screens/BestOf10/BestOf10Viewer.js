import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TextInput, Dimensions, Text, ActivityIndicator } from "react-native";
import Constants from "expo-constants";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import Fire from "../../Api/Fire";
import Dialog, { DialogFooter, DialogButton, SlideAnimation, DialogContent } from "react-native-popup-dialog";
import { convertArabicNumbers, displayMessage } from "../../util/extraMethods";
import BestOfCard from "../../components/BestOfCard";
import firebase from "firebase/app";
import I18n from '../Translation/I18n';

const { width } = Dimensions.get("screen");

const BestOf10Viewer = ({ route, navigation }) => {
  const { title } = route.params;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [balls, setBalls] = useState("0");
  const [user, setUser] = useState({});
  const [list, setList] = useState([]);
  const [bestOf, setBestOf] = useState("BestAttacker");

  //Get All BestOf Collection
  useEffect(() => {
    let isMounted = true;
    let subscriber = null;

    if (isMounted) {
      switch (title) {
        case I18n.t('beststriker'):
          subscriber = Fire.getAllBestOf("BestAttacker", (players) => {
            setList(players);
            setBestOf("BestAttacker");
          });
          break;
        case I18n.t('bestmidfielder'):
          subscriber = Fire.getAllBestOf("BestMiddlePlayer", (players) => {
            setList(players);
            setBestOf("BestMiddlePlayer");
          });
          break;
        case I18n.t('bestdefender'):
          subscriber = Fire.getAllBestOf("BestDefender", (players) => {
            setList(players);
            setBestOf("BestDefender");
          });
          break;
        case I18n.t('bestgoalkeeper'):
          subscriber = Fire.getAllBestOf("BestGoalKeeper", (players) => {
            setList(players);
            setBestOf("BestGoalKeeper");
          });
          break;
        case I18n.t('Themostpopularclub'):
          subscriber = Fire.getAllBestOf("BestClub", (clubs) => {
            setList(clubs);
            setBestOf("BestClub");
          });
          break;
        case I18n.t('worldCup'):
          subscriber = Fire.getAllBestOf("WorldClub", (countries) => {
            setList(countries);
            setBestOf("WorldClub");
          });
          break;
      }
      getUser();
      setLoading(false);
    }

    return () => {
      subscriber != null ? subscriber.off() : null;
      isMounted = false;
    };
  }, []);

  //get User
  const getUser = async () => {
    const user = await Fire.getUser(Fire.uid);
    setUser(user);
  };

  //Update Player Points
  const updatePlayer = async () => {
    let b = convertArabicNumbers(balls);

    //Check if user has enough balls
    if (user.silverBalls < parseInt(b)) {
      displayMessage(I18n.t('Youdonhaveenoughballs'));
      setVisible(false);
      return;
    }

    //Check if user already voted or not
    if (item != null) {
      if (item.usersVoted != null) {
        if (item.usersVoted.some((u) => u.user === user.uid)) {
          displayMessage(I18n.t('Youhavealreadyrated'));
          setVisible(false);
          return;
        }
      }
    }

    if (parseInt(b) < 50) {
      displayMessage(I18n.t('Theminimumnumberof'));
      return;
    }

    var usersVoted = item.usersVoted
      ? [...item.usersVoted, { user: user.uid, balls: parseInt(b) }]
      : [{ user: user.uid, balls: parseInt(b) }];

    const res = await Fire.updateBestOf(bestOf, item.uid, {
      ballsPoints: item.ballsPoints + parseInt(b),
      usersVoted: usersVoted,
    });
    if (!res) return displayMessage(I18n.t('Errors'));

    const response = await Fire.updateUser(user.uid, {
      silverBalls: firebase.firestore.FieldValue.increment(-parseInt(b)),
    });

    if (response) {
      setVisible(false);
      displayMessage(I18n.t('Successfullynominated'));
      getUser();
    } else {
      displayMessage(I18n.t('Errors'));
    }
  };

  const renderContentAboveFlatList = () => {
    return (
      <View>
        <View style={styles.title}>
          <View style={{ justifyContent: "center", alignItems: "center", marginTop: 15 }}>
            <Text style={[styles.title, { marginTop: 30, marginBottom: 5, color: "gold" }]}>{title}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <BestOfCard
        top={index == 0}
        item={item}
        title={title}
        onPress={() => {
          setVisible(true);
          setItem(item);
        }}
      />
    );
  };

  //Render Loading icon when loading more items in the list
  const renderLoading = () => {
    if (!loading) return null;
    return (
      <View>
        <ActivityIndicator style={{ marginTop: 20 }} animating color="#fff" size="large" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <Animatable.View animation="bounceIn" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ListItem.Title style={{ color: "#fff", fontSize: 30 }}>{I18n.t('Thereisnoplayerorteam')}</ListItem.Title>
      </Animatable.View>
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <Animatable.View animation="fadeInUpBig">
        <FlatList
          data={list}
          ListHeaderComponent={renderContentAboveFlatList}
          listEmptyComponent={renderEmpty}
          ListFooterComponent={renderLoading}
          keyExtractor={(item) => item.uid}
          renderItem={renderItem}
        />

        <Dialog
          visible={visible}
          dialogAnimation={new SlideAnimation({ slideFrom: "bottom" })}
          footer={
            <DialogFooter>
              <DialogButton text={I18n.t('Cancel')} onPress={() => setVisible(false)} />
              <DialogButton text={I18n.t('Submit')}  onPress={updatePlayer} />
            </DialogFooter>
          }
        >
          <DialogContent style={{ padding: 20 }}>
            {item == null ? null : <Text> {item.name} </Text>}
            <View style={styles.action}>
              <TextInput
                keyboardType="numeric"
                placeholder={I18n.t('numberofsilverballs')}
                placeholderTextColor="grey"
                style={styles.textInput}
                value={balls}
                onChangeText={(text) => setBalls(text)}
              />
              <Icon name="soccer" style={{ marginStart: 5 }} color="#000" size={20} />
            </View>
          </DialogContent>
        </Dialog>
      </Animatable.View>
    </LinearGradient>
  );
};

export default BestOf10Viewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    marginTop: Constants.statusBarHeight,
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  action: {
    width: width / 2,
    flexDirection: "row",
    marginTop: 20,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -4,
    paddingLeft: 10,
    color: "#000",
  },
});
