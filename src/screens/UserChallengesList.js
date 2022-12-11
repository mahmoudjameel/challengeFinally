import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { SearchBar } from "react-native-elements";
import Card from "../components/Card";
import { LinearGradient } from "expo-linear-gradient";
import ModalSelector from "react-native-modal-selector";
import { searchFilter } from "../util/SelectorData";
import { FontAwesome } from "@expo/vector-icons";
import Fire from "../Api/Fire";
import * as Animatable from "react-native-animatable";
import { getTimeLeft } from "../util/extraMethods";
import I18n from '../screens/Translation/I18n';

const UserChallengesList = ({ navigation }) => {
  const [filter, setFilter] = useState(searchFilter[0].label);
  const [loading, setLoading] = useState(true);
  const [search, setsearch] = useState("");
  const [data, setData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [user, setUser] = useState(null);

  //Get User's challenges list
  useEffect(() => {
    getChallenges();
  }, []);

  const getChallenges = async () => {
    const challenges = await Fire.getAllChallengesForUser(Fire.uid);
    const user = await Fire.getUser(Fire.uid);
    setUser(user);
    setData(challenges);
    setFullData(challenges);
    setLoading(false);
  };

  const renderItem = ({ item }) => {
    let time = getTimeLeft(item);
    let type = time <= 0 ? 2 : 1;

    return (
      <Card
        time={time <= 0 ? I18n.t('Ifinish') : `${time} ${I18n.t('Hours')} `}
        itemData={item}
        onPress={() => navigation.navigate( I18n.t('Challengeinfo'), { itemData: item.uid, type: type })}
      />
    );
  };

  //Search and filter functions
  const handleSearch = (text, filter) => {
    setsearch((search) => text);

    //search
    let filteredData = fullData.filter((challenge) => challenge.title.toLocaleLowerCase().includes(text.trim()));

    //filter
    switch (filter) {
      case searchFilter[1].label:
        filteredData = filteredData.filter((challenge) =>
          challenge.prizes.some((prize) => prize.user === user.username)
        );
        break;
      case searchFilter[2].label:
        filteredData = filteredData.filter(
          (challenge) => challenge.prizes.filter((prize) => prize.user === user.username).length == 0
        );
        break;
      default:
        filteredData = filteredData;
        break;
    }

    setData(filteredData);
  };

  const getAnswers = () => {
    let answers = 0;

    fullData.forEach((challenge) => {
      if (challenge.usersAnswered != null) {
        answers = answers + Object.values(challenge.usersAnswered).filter((ans) => ans.userId === Fire.uid).length;
      }
    });

    user
      ? user.challengesAnswers || 0 == answers
        ? null
        : (async () => {
            answers ? await Fire.updateUser(user.uid, { challengesAnswers: answers }) : null;
          })()
      : null;

    return answers;
  };

  const renderLoading = () => {
    if (!loading) return null;
    return (
      <View style={{ paddingVertical: 20, borderTopWidth: 1, borderColor: "#CED0CE" }}>
        <ActivityIndicator animating color="#fff" size="large" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <Animatable.View animation="bounceIn" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff", fontSize: 35 , marginTop:10}}>{I18n.t('Youdidnotparticipateinanychallenge')}</Text>
      </Animatable.View>
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <View>
        <SearchBar
          containerStyle={styles.header}
          round
          lightTheme
          placeholder={I18n.t('Search')}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(text) => handleSearch(text, filter)}
          value={search}
        />
        <View style={styles.filters}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#fff" }}> {I18n.t('Numberofresponsestochallenges')}{`${getAnswers()}`}</Text>
          </View>
          <ModalSelector
            initValueTextStyle={{ color: "#fff" }}
            style={{ height: 50, flex: 1 }}
            data={searchFilter}
            initValue={I18n.t('All')}
            onChange={(option) => {
              setFilter(option.label);
              handleSearch(search, option.label);
            }}
            cancelText={I18n.t('Cancel')}
          >
            <View style={styles.selector}>
              <Text style={styles.filter}>{filter}</Text>
              <FontAwesome name="caret-down" style={styles.icon} color={"#fff"} size={25} />
            </View>
          </ModalSelector>
        </View>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderLoading}
        keyExtractor={(item) => item.uid}
      />
    </LinearGradient>
  );
};

export default UserChallengesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  header: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  filters: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  filter: {
    flex: 1,
    padding: 5,
    height: 30,
    color: "#fff",
  },
  icon: {
    padding: 5,
    paddingRight: 20,
  },
});
