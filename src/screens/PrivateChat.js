import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar, Header } from "react-native-elements";
import Chat from "../components/Chat";
import { Ionicons as Icon } from "@expo/vector-icons";
import Fire from "../Api/Fire";
import { v4 as uuidv4 } from "uuid";
import I18n from '../screens/Translation/I18n';

const PrivateChat = ({ route, navigation }) => {
  const { userId, userName, userImage, roomId } = route.params;
  const [room, setRoom] = useState(roomId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (roomId == null) {
        (async () => {
          const user = await Fire.getUser(Fire.uid);
          if (user[`chatRooms`] && user['chatRooms'].hasOwnProperty(userId)) {
            setRoom(user[`chatRooms`][userId].roomId);
            setLoading(false);
          } else {
            let chatKey = uuidv4();
            await Fire.updateUser(Fire.uid, {
              ["chatRooms." + userId]: {
                roomId: chatKey,
                unseen: 0,
                userId: userId,
                userImage: userImage,
                userName: userName,
              },
            });
            await Fire.updateUser(userId, {
              ["chatRooms." + user.uid]: {
                roomId: chatKey,
                unseen: 0,
                userId: user.uid,
                userImage: user.image,
                userName: user.username,
              },
            });
            setRoom(chatKey);
            setLoading(false);
          }
        })();
      } else {
        setLoading(false);
      }
    }
    return () => (isMounted = false);
  }, []);

  const renderLoading = () => {
    if (!loading) return null;

    return (
      <View>
        <ActivityIndicator style={{ marginTop: 20 }} animating color="#fff" size="large" />
      </View>
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={{ flex: 1 }}>
      <Header
        containerStyle={{ backgroundColor: "transparent", borderBottomWidth: 0 }}
        placement="right"
        leftComponent={
          <Icon.Button
            name="md-arrow-back"
            size={30}
            color="#fff"
            style={{ paddingVertical: 0 }}
            backgroundColor="transparent"
            onPress={() => navigation.goBack()}
          />
        }
        rightComponent={
          <Avatar
            rounded
            size={30}
            source={{ uri: userImage }}
            onPress={() => {
              navigation.navigate("FriendsFavorite", {
                screen: I18n.t('Atachment'),
                params: { userId: userId, type: 2 },
              });
            }}
          />
        }
        centerComponent={{ text: userName || "Unknown", style: { color: "#fff", fontWeight: "bold", fontSize: 20 } }}
      />
      {renderLoading()}
      {!loading && room != null ? (
        <Chat
          roomId={room}
          secUserId={userId}
          secUserName={userName}
          secUserImage={userImage}
          navigation={navigation}
          type="Private-Chat"
        />
      ) : null}
    </LinearGradient>
  );
};

export default PrivateChat;
