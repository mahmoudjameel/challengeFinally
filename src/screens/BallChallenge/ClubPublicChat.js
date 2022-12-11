import React, { useEffect, useState } from "react";
import Chat from "../../components/Chat";
import Fire from "../../Api/Fire";
import { Text } from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import I18n from '../Translation/I18n';

const ClubPublicChat = ({ route, navigation }) => {
  const { clubId } = route.params;
  const [visible, setvisible] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await Fire.getUser(Fire.uid);
      const balls = await Fire.getAllBalls(user.subscription);
      if (balls.joinChatForOtherClubs) return;
      if (clubId != user.favLocalTeam && clubId != user.FavInterTeam) setvisible(false);
    })();
  }, []);

  if (!visible)
    return (
      <LinearGradient
        colors={["#2b5876", "#4e4376"]}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Animatable.View animation="bounceIn">
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            {I18n.t('Generalteamchatgoldenmembership')}
          </Text>
        </Animatable.View>
      </LinearGradient>
    );

  return <Chat clubId={clubId} navigation={navigation} type="Club-Chat" />;
};

export default ClubPublicChat;
