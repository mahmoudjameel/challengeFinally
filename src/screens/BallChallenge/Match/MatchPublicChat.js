import React from "react";
import Chat from "../../../components/Chat";

const MatchPublicChat = ({ route, navigation }) => {
  const { clubId, matchId } = route.params;
  return <Chat clubId={clubId} matchId={matchId} navigation={navigation} type="Match-Chat" />;
};

export default MatchPublicChat;
