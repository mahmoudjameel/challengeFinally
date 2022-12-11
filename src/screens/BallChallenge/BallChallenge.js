import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Carousel from "react-native-snap-carousel";
import { countries } from "../../util/SelectorData";
import * as Animatable from "react-native-animatable";
import { Avatar, ListItem } from "react-native-elements";
import * as Constants from "../../util/constants";
import I18n from '../Translation/I18n';

const { height, width } = Dimensions.get("screen");

const BallChallenge = ({ navigation }) => {
  const [loading, setloading] = useState(true);
  const [clubs, setclubs] = useState([]);
  const _carousel = React.useRef();

  //Get Clubs list
  useEffect(() => {
    let mounted = true;
    if (mounted) getTeams(421);
    return () => (mounted = false);
  }, []);

  const getTeams = async (league) => {
    try {
      setloading((loading) => true);

      //get league teams
      let response = await fetch(`${Constants.API_ENDPOINT}Teams&leagueId=${league}&APIkey=${Constants.API_KEY}`, {
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      let json = await response.json();

      //If there is an error
      if ("error" in json) return setloading((loading) => false), setclubs([]);

      let teams = [];
      Object.values(json.result).forEach((team) =>
        teams.push({ uid: team.team_key, image: team.team_logo, name: team.team_name })
      );
      setclubs(teams);
      setloading((loading) => false);
    } catch (error) {
      alert(error.message);
      setloading((loading) => false);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View style={{ paddingVertical: 20, borderTopWidth: 1, borderColor: "#CED0CE" }}>
        <ActivityIndicator animating color="#fff" size="large" />
      </View>
    );
  };

  const _renderCountry = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.label}</Text>
      </View>
    );
  };

  const _renderClub = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.club}
        onPress={() => navigation.navigate(I18n.t('Teamhomepage'), { clubId: item.uid })}
      >
        <View style={{ justifyContent: "space-evenly", alignItems: "center" }}>
          <Avatar size={100} source={{ uri: item != null ? item.image : "????" }} />
          <Text style={styles.title}>{item != null ? item.name : "????"}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const _renderEmpty = () => {
    if (loading) return null;

    return (
      <Animatable.View animation="bounceIn" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ListItem.Title style={{ color: "#fff", fontSize: 30 }}>{I18n.t('Thereisnoteam')}</ListItem.Title>
      </Animatable.View>
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <Carousel
        containerCustomStyle={{ backgroundColor: "#02aab0" }}
        layout={"default"}
        ref={_carousel}
        renderItem={_renderCountry}
        sliderWidth={width}
        itemWidth={150}
        onSnapToItem={(index) => getTeams(countries[index + 1].league)}
        data={countries.filter((country) => {
          return country.key != "00";
        })}
      />
      <FlatList
        data={clubs}
        ListEmptyComponent={_renderEmpty}
        ListFooterComponent={renderFooter}
        renderItem={_renderClub}
        keyExtractor={(item) => item.uid}
        numColumns={3}
      />
    </LinearGradient>
  );
};

export default BallChallenge;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    height: height * 0.05,
    justifyContent: "center",
    alignItems: "center",
    borderStartWidth: 1,
    borderStartColor: "#fff",
  },
  title: {
    fontSize: 15,
    color: "#fff",
  },
  image: {
    height: height * 0.05,
  },
  club: {
    height: width / 3,
    margin: 15,
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemInvisible: {
    backgroundColor: "transparent",
  },
});
