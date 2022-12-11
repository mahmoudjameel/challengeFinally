import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import StarRating from "./StarRating";

const PlayerCard = ({ item, onPress, type }) => {
  switch (type) {
    case "referee":
      return (
        <ListItem containerStyle={{ backgroundColor: "#fff", margin: 10, borderRadius: 5 }}>
          <Avatar source={{ uri: item.image }} />
          <ListItem.Content style={{ borderBottomWidth: 0, flexDirection: "row" }}>
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <ListItem.Title style={{ color: "#000" }}>{item.name}</ListItem.Title>
            </View>
            <ListItem.Subtitle style={{ color: "#000" }}>
              <StarRating ratings={item.rating} reviews={item.reviews.length} />
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      );
    case "player":
      return (
        <ListItem containerStyle={{ backgroundColor: "#fff", borderRadius: 5, margin: 10 }} onPress={onPress}>
          <View style={styles.number}>
            <Text style={{ color: "#fff" }}> {item.number} </Text>
          </View>

          <ListItem.Content style={{ borderBottomWidth: 0, flexDirection: "row" }}>
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <ListItem.Title style={{ color: "#000" }}>{item.name}</ListItem.Title>
              <ListItem.Subtitle style={{ color: "red" }}>{item.type}</ListItem.Subtitle>
            </View>
            {onPress != null ? (
              <View style={{ alignItems: "center" }}>
                <StarRating ratings={item.rating} reviews={item.reviews.length} />
              </View>
            ) : null}
          </ListItem.Content>
        </ListItem>
      );
  }
};

const styles = StyleSheet.create({
  deleteBox: {
    borderRadius: 5,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
  },
  text: {
    fontSize: 18,
    color: "gold",
    margin: 10,
    fontWeight: "bold",
  },
  vs_text: {
    flex: 1,
    fontSize: 25,
    color: "#000",
    fontWeight: "bold",
  },
  number: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PlayerCard;
