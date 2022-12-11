import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ListItem } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Fire from "../Api/Fire";
import I18n from '../screens/Translation/I18n';

const BestOfCard = ({ item, onPress, title, top }) => {
  return (
    <ListItem
      key={item.uid}
      containerStyle={{ backgroundColor: top && item.ballsPoints ? "#ffd700" : "#fff", margin: 10, borderRadius: 5 }}
      onPress={onPress}
    >
      <View style={styles.number}>
        <Text style={styles.white}> {item.ballsPoints} </Text>
      </View>
      <ListItem.Content style={styles.content}>
        <View style={styles.row}>
          <ListItem.Title style={styles.black}>{item.name}</ListItem.Title>
          {title == I18n.t('numberofpponentgoal') ? (
            <View>
              <ListItem.Subtitle style={styles.black}>{I18n.t('Thenumbergoalsteamgoal')} {item.goalsForTeam}</ListItem.Subtitle>
              <ListItem.Subtitle style={styles.black}>
              {I18n.t('Thenumbergoalsteamgoal')} {item.goalsOnTeam}
              </ListItem.Subtitle>
            </View>
          ) : null}
          <ListItem.Subtitle style={styles.red}>{item.usersVoted ? item.usersVoted.length : 0} {I18n.t('candidate')}</ListItem.Subtitle>
        </View>
        <MaterialCommunityIcons
          name={
            item.usersVoted
              ? item.usersVoted.some((u) => u.user === Fire.uid)
                ? "star"
                : "star-outline"
              : "star-outline"
          }
          size={35}
          color={
            item.usersVoted
              ? item.usersVoted.some((u) => u.user === Fire.uid)
                ? top
                  ? "#fff"
                  : "#ffd700"
                : "#000"
              : "#000"
          }
        />
      </ListItem.Content>
    </ListItem>
  );
};

export default BestOfCard;
const styles = StyleSheet.create({
  number: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { borderBottomWidth: 0, flexDirection: "row", alignItems: "center" },
  row: { flex: 1, alignItems: "flex-start" },
  back: { color: "#000" },
  white: { color: "#fff" },
  red: { color: "red" },
});
