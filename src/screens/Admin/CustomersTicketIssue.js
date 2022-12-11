import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Fire from "../../Api/Fire";

const CustomersTicketIssue = () => {
  const [state, setState] = useState({ loading: true, tickets: [] });

  //Get all the tickets from database
  useEffect(() => {
    //Get tickets
    const subscriber = Fire.getAllTickets((tickets) => setState({ ...state, loading: false, tickets: tickets }));
    return () => subscriber.off();
  }, []);

  //Display loader while getting data from database
  const renderFooter = () => {
    if (!state.loading) return null;

    return (
      <View style={{ paddingVertical: 20, borderTopWidth: 1, borderColor: "#CED0CE" }}>
        <ActivityIndicator animating color="#fff" size="large" />
      </View>
    );
  };

  //On swipe left
  const leftSwipe = (progress, id) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });
    return (
      <TouchableOpacity onPress={async () => await Fire.updateTicket(id)} activeOpacity={0.6}>
        <View style={styles.deleteBox}>
          <Animated.Text style={{ color: "#000", transform: [{ translateX: trans }] }}>تم حل المشكلة</Animated.Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (state.loading) return null;

    return (
      <Animatable.View animation="bounceIn" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ListItem.Title style={{ color: "#fff", fontSize: 30 }}>لا يوجد مشاكل للمستخدمين</ListItem.Title>
      </Animatable.View>
    );
  };

  //Render List ticket
  const renderTicket = ({ item }) => {
    return (
      <Swipeable renderLeftActions={(progress) => leftSwipe(progress, item.uid)}>
        <Animatable.View animation="bounceIn">
          <ListItem containerStyle={styles.item}>
            <LinearGradient
              style={styles.card}
              colors={["#02aab0", "#00cdac"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Avatar size={50} rounded={true} source={{ uri: item != null ? item.userImage : "????" }} />
              <ListItem.Content style={styles.content}>
                <View style={{ alignItems: "flex-start" }}>
                  <ListItem.Title style={styles.time}>{item.userName || "????"}</ListItem.Title>
                  <ListItem.Subtitle style={{ color: "#fff" }}>{item.userEmail || "????"}</ListItem.Subtitle>
                  <Text numberOfLines={11} style={{ marginTop: 10, color: "#fff", flex: 1 }}>
                    {item.message || "????"}
                  </Text>
                </View>
              </ListItem.Content>
            </LinearGradient>
          </ListItem>
        </Animatable.View>
      </Swipeable>
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <Animatable.View animation="bounceIn">
        <FlatList
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          data={state.tickets}
          renderItem={renderTicket}
          keyExtractor={(item) => item.uid}
        />
      </Animatable.View>
    </LinearGradient>
  );
};

export default CustomersTicketIssue;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
  text: {
    fontSize: 18,
    color: "gold",
    fontWeight: "bold",
  },
  time: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    height: 310,
    width: "100%",
    flexDirection: "row",
    padding: 10,
    borderRadius: 5,
  },
  deleteBox: {
    borderRadius: 5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 310,
  },
  item: { backgroundColor: "transparent", padding: 0, marginBottom: 20 },
  content: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
});
