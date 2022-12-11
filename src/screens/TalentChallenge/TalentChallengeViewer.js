import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import ChallengeView from "../../components/ChallengeView";
import { Header } from "react-native-elements";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Fire from "../../Api/Fire";
import { getTimeLeft } from "../../util/extraMethods";
import I18n from '../Translation/I18n';

const TalentChallengeViewer = ({ route, navigation }) => {
  const { itemData, type } = route.params;
  const [user, setUser] = useState({});
  const [challenge, setChallenge] = useState({});
  const [points, setPoints] = useState(15);
  const [challengeUser, setChallengeUser] = useState(null);

  useEffect(() => {
    //get the challenge
    const subscription = Fire.getChallenge(itemData, (challenge) => {
      setChallenge(challenge);
      if (!challengeUser) getChallengeUser(challenge.user.uid);
    });

    //get the user
    const userSubscription = Fire.observeUser(Fire.uid, (user) => {
      setUser(user);

      (async () => {
        const res = await Fire.getAllBalls(user.subscription);
        setPoints(parseInt(res.replyToChallenge) || 15);
      })();
    });

    return () => {
      subscription ? subscription.off() : null;
      userSubscription ? userSubscription() : null;
    };
  }, []);

  const addToFavorite = async () => {
    await Fire.addChallengeToFavorites(itemData, user.uid);
  };

  const removeFromFavorite = async () => {
    await Fire.removeChallengeFromFavorites(itemData, user.uid);
  };

  const getChallengeUser = async (uid) => {
    const user = await Fire.getUser(uid);
    setChallengeUser(user);
  };

  return (
    <View style={styles.container}>
      <Header
        containerStyle={styles.header}
        placement="right"
        leftComponent={
          <View style={{ flexDirection: "row" }}>
            <Ionicons.Button
              name="arrow-back"
              size={30}
              color="#fff"
              backgroundColor="transparent"
              onPress={() => navigation.goBack()}
            />
            <MaterialCommunityIcons.Button
              name="heart"
              size={30}
              color={Object.keys(challenge.favorites || {}).some((fav) => fav === user.uid) ? "#FF5757" : "#fff"}
              backgroundColor="transparent"
              onPress={
                Object.keys(challenge.favorites || {}).some((fav) => fav === user.uid)
                  ? removeFromFavorite
                  : addToFavorite
              }
            />
          </View>
        }
        rightComponent={{ text: `${I18n.t('remainingtime')} ${getTimeLeft(challenge)} ${I18n.t('Hours')}`, style: styles.rightComponent }}
      />
      <ChallengeView
        type={type}
        nav={navigation}
        challenge={challenge}
        user={user}
        points={points}
        otheruser={challengeUser}
      />
   
    </View>
  );
};

export default TalentChallengeViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    zIndex: 999,
    width: "100%",
    position: "absolute",
    backgroundColor: "transparent",
    borderBottomWidth: 0,
  },
  rightComponent: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 10,
    marginRight:18
  },
});
