import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Fire from "../Api/Fire";
import I18n from '../screens/Translation/I18n';

const StoreCard = ({ type, itemData, onPress }) => {
  return (
    <Animatable.View animation="bounceIn">
      <ListItem containerStyle={{ backgroundColor: "transparent", padding: 0, marginBottom: 20 }} onPress={onPress}>
        <LinearGradient
          style={styles.card}
          colors={["#02aab0", type == 1 ? (itemData.user.uid == Fire.uid ? "silver" : "#00cdac") : "#00cdac"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ListItem.Content style={{ width: "100%", alignItems: "center" }}>
            <View style={{ alignItems: "center" }}>
              {type == 1 ? (
                <>
                  <MaterialCommunityIcons name="soccer" size={80} color="white" />
                  <Avatar rounded size={30} source={{ uri: itemData.user.image || "" }} />
                  <Text style={styles.text}>{itemData.user ? itemData.user.username : "???"}</Text>
                </>
              ) : (
                <>
                  <Avatar
                    size={100}
                    imageProps={{ resizeMode: "contain" }}
                    source={itemData.image ? { uri: itemData.image } : require("../../assets/default.png")}
                  />
                  <Text style={styles.text}>{itemData.user ? itemData.user.username : "???"}</Text>
                </>
              )}
            </View>

            {type == 1 ? (
              <View style={{ alignItems: "center" }}>
                <ListItem.Title style={styles.number}>{itemData.amount}</ListItem.Title>
                <ListItem.Title style={styles.number}>{itemData.price || "0"} {I18n.t('riyal')}</ListItem.Title>
              </View>
            ) : (
              <View style={{ alignItems: "center" }}>
                <ListItem.Title style={styles.number}>{itemData.name || "???"}</ListItem.Title>
                <ListItem.Title style={styles.number}>{itemData.amount || "1"}</ListItem.Title>
                <ListItem.Title style={styles.number}>{itemData.price || "10"} {I18n.t('silverball')}</ListItem.Title>
              </View>
            )}
          </ListItem.Content>
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
  text: {
    fontSize: 15,
    color: "gold",
    fontWeight: "bold",
  },
  number: {
    margin: 5,
    fontSize: 13,
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    borderRadius: 25,
    margin: 10,
  },
});

export default StoreCard;
