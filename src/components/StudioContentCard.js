import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import StarRating from "./StarRating";
import { Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";

const StudioContentCard = ({ item, onPress }) => {
  return (
    <ListItem containerStyle={styles.container} onPress={onPress}>
      <LinearGradient style={styles.card} colors={["#02aab0", "#00cdac"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        {item.type == "video/mp4" ? (
          <Video
            style={styles.video}
            shouldPlay={false}
            useNativeControls={false}
            source={{ uri: item.imageVideo }}
            resizeMode="cover"
          />
        ) : (
          <Avatar rounded={true} containerStyle={styles.image} source={{ uri: item.imageVideo }} />
        )}

        <ListItem.Content>
          <View style={styles.content}>
            <ListItem.Subtitle style={styles.reviews}>
              {<StarRating ratings={item.rating} reviews={item.reviews != null ? item.reviews.length : 0} />}
            </ListItem.Subtitle>
            <View style={{ flex: 2.5 }}>
              <ListItem.Title style={styles.username}>{item.userName}</ListItem.Title>
              <ListItem.Title style={styles.title}>
                {item.title.length > 20 ? item.title.substring(0, 20 - 3) + "..." : item.title}
              </ListItem.Title>
            </View>
            <Avatar rounded={true} size={30} source={{ uri: item.userImage }} />
          </View>
        </ListItem.Content>
      </LinearGradient>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 15,
    borderRadius: 25,
  },
  username: {
    marginHorizontal: 10,
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    alignSelf: "flex-end",
  },
  title: {
    marginHorizontal: 10,
    color: "#fff",
    fontSize: 15,
  },
  content: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 5,
  },
  reviews: {
    color: "#fff",
    marginTop: 5,
  },
  container: {
    backgroundColor: "transparent",
    padding: 0,
    marginBottom: 20,
  },
  video: {
    width: "100%",
    height: 200,
    borderRadius: 20,
  },
  image: {
    width: "100%",
    height: 200,
  },
});

export default StudioContentCard;
