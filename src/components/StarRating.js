import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const StarRating = ({ color = "#000", ratings, reviews, big, bottom }) => {
  // This array will contain our star tags. We will include this
  // array between the view tag.
  let stars = [];
  // Loop 5 times
  for (var i = 1; i <= 5; i++) {
    // set the path to filled stars
    let name = "ios-star";
    // If ratings is lower, set the path to unfilled stars
    if (i > ratings) {
      name = "ios-star-outline";
    }

    stars.push(<Ionicons name={name} size={big ? 20 : 15} color="#FF8C00" key={i} />);
  }

  return (
    <View style={[styles.container, { flexDirection: bottom ? "column" : "row" }]}>
      <View style={{ flexDirection: "row" }}>{stars}</View>
      <Text style={[styles.text, { color: color, fontSize: big ? 16 : 12 }]}>({reviews})</Text>
    </View>
  );
};

export default StarRating;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  text: {
    marginLeft: 5,
  },
});
