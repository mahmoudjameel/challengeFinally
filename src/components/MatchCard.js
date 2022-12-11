import React from "react";
import { StyleSheet, View, Text } from "react-native";
import moment from "moment";
import StarRating from "./StarRating";
import { Avatar, ListItem } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import I18n from '../screens/Translation/I18n';

const MatchCard = ({ match, type, onPress }) => {
  //get time
  const getTime = () => {
    let dateNow = moment().local();
    let date = moment(match.event_date + " " + match.event_time).add(1, "hours");
    let diff = moment.duration(dateNow.diff(date)).minutes();

    if (diff <= 120 && diff >= 0) {
      return I18n.t('livenow') ;
    } else if (diff > 120) {
      return I18n.t('GameOver');
    } else {
      return date.format("HH:mm");
    }
  };

  return (
    <Animatable.View animation="bounceIn">
      <ListItem containerStyle={{ backgroundColor: "transparent", padding: 0, marginBottom: 20 }} onPress={onPress}>
        <LinearGradient style={styles.card} colors={["#02aab0", "#00cdac"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.team_container}>
            <View style={{ flex: 2, alignItems: "center" }}>
              <Avatar size={100} source={{ uri: match.home_team_logo }} />
              <Text style={styles.text}>{match.event_home_team}</Text>
            </View>

            <Text style={styles.vs_text}> VS </Text>
            <View style={{ flex: 2, alignItems: "center" }}>
              <Avatar size={100} source={{ uri: match.away_team_logo }} />
              <Text style={styles.text}>{match.event_away_team}</Text>
            </View>
          </View>

          {type == 1 ? (
            <ListItem.Content style={{ marginTop: 10, width: "100%", alignItems: "center", justifyContent: "center" }}>
              <ListItem.Title style={styles.time}>{match.event_date}</ListItem.Title>
              <ListItem.Title style={styles.time}>{getTime()}</ListItem.Title>
              <ListItem.Title style={styles.time}>{match.league_name}</ListItem.Title>
            </ListItem.Content>
          ) : (
            <ListItem.Content style={{ marginTop: 10, width: "100%", alignItems: "center", justifyContent: "center" }}>
              <Avatar
                size={50}
                rounded={true}
                source={{ uri: "https://api.adorable.io/avatars/80/abott@adorable.png" }}
              />
              <ListItem.Title style={styles.time}>{match.commentorName}</ListItem.Title>
              {<StarRating ratings={match.rating} reviews={match.reviews.length} />}
            </ListItem.Content>
          )}
        </LinearGradient>
      </ListItem>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  team_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  vs_text: {
    flex: 1,
    fontSize: 25,
    color: "#fff",
    fontWeight: "bold",
    paddingLeft: 10,
  },
  text: {
    fontSize: 18,
    color: "gold",
    fontWeight: "bold",
  },
  time: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 10,
    borderRadius: 25,
  },
});

export default MatchCard;
