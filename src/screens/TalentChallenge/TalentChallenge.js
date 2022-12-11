import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity , RefreshControl, I18nManager} from "react-native";
import { SearchBar } from "react-native-elements";
import Card from "../../components/Card";
import { LinearGradient } from "expo-linear-gradient";
import ModalSelector from "react-native-modal-selector";
import { getTimeLeft } from "../../util/extraMethods";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Fire from "../../Api/Fire";
import * as Animatable from "react-native-animatable";
import I18n from '../Translation/I18n';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const TalentChallenge = ({ navigation }) => {
  const talentSort = [
    { key: 1, label: I18n.t('latest') },
    { key: 2, label: I18n.t('toprated') },
    { key: 3, label: I18n.t('oldest') },
    { key: 4, label: I18n.t('lowestrated') },
  ];

  const talentFilter = [
    { key: 0, label: I18n.t('All')  },
    { key: 1, label: I18n.t('public') },
    { key: 2, label: I18n.t('theathlete') },
    { key: 3, label:  I18n.t('cultural') },
    { key: 4, label: I18n.t('arts')},
    { key: 5, label: I18n.t('educational') },
    { key: 6, label: I18n.t('closedchallenges') },
    { key: 7, label: I18n.t('openchallenges') },
    { key: 8, label: I18n.t('FinishedChallenges')},
    { key: 9, label: I18n.t('yourchallenges') },
    { key: 10, label: I18n.t('Favorites') },
  ];
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [challenges, setChallenges] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [filter, setFilter] = useState(talentFilter[0].label);
  const [sort, setSort] = useState(talentSort[0].label);

  useEffect(() => {
    const subscriber = Fire.getAllChallenges((challenges) => {
      setChallenges(challenges);
      setFullData(challenges);
      handleSort(challenges, sort);
      handleSearch(challenges, search, filter);
      setLoading(false);
    });

    return () => (subscriber ? subscriber.off() : null);
  }, []);

  const renderItem = ({ item }) => {
    let time = getTimeLeft(item);
    let type = time <= 0 ? 2 : 1;

    return (
      <Card
        time={time <= 0 ? I18n.t('Ifinish') : `${time} ${I18n.t('Hourss')}`}
        itemData={item}
        onPress={() => navigation.navigate(I18n.t('challengepage'), { itemData: item.uid, type: type })}
      />
    );
  };

  

  //search and filter
  const handleSearch = (fullData, query, filter) => {
    const text = query.toLocaleLowerCase();
    setSearch((prev) => text);

    //search
    let filteredData =
      text.trim().length != 0
        ? fullData.filter((challenge) => challenge.title?.toLocaleLowerCase().includes(text))
        : fullData;

    //filter
    switch (filter) {
      case talentFilter[0].label:
        filteredData = filteredData.filter((challenge) => getTimeLeft(challenge) >= 0);
        break;
      case talentFilter[6].label:
        filteredData = filteredData.filter((challenge) => challenge.isClosed && getTimeLeft(challenge) >= 0);
        break;
      case talentFilter[7].label:
        filteredData = filteredData.filter((challenge) => !challenge.isClosed && getTimeLeft(challenge) >= 0);
        break;
      case talentFilter[8].label:
        filteredData = filteredData.filter((challenge) => getTimeLeft(challenge) <= 0);
        break;
      case talentFilter[9].label:
        filteredData = filteredData.filter(
          (challenge) => challenge?.user?.uid == Fire.uid && getTimeLeft(challenge) >= 0
        );
        break;
      case talentFilter[10].label:
        filteredData = filteredData.filter((challenge) =>
          Object.keys(challenge.favorites || {}).some((fav) => fav === Fire.uid)
        );
        break;
      default:
        filteredData = filteredData.filter(
          (challenge) => challenge?.category?.toLocaleLowerCase().includes(filter) && getTimeLeft(challenge) >= 0
        );
        break;
    }

    setChallenges(filteredData);
  };

  const handleSort = (challenges, sortBy) => {
    setSort(sortBy);
    if (challenges.length <= 1) return;
    if (sortBy == talentSort[0].label) setChallenges(challenges.sort((a, b) => b.createdAt - a.createdAt));
    if (sortBy == talentSort[1].label) setChallenges(challenges.sort((a, b) => (b.rating || 0) - (a.rating || 0)));
    if (sortBy == talentSort[2].label) setChallenges(challenges.sort((a, b) => a.createdAt - b.createdAt));
    if (sortBy == talentSort[3].label) setChallenges(challenges.sort((a, b) => (a.rating || 0) - (b.rating || 0)));
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ paddingVertical: 20, borderTopWidth: 1, borderColor: "#CED0CE" }}>
        <ActivityIndicator animating size="large" color="#fff" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <Animatable.View animation="bounceIn" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff", fontSize: 30 }}>{I18n.t('Thereisnochallenge')}</Text>
      </Animatable.View>
    );
  };
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);


  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.parent_container}>
      <View style={styles.container}>
        <SearchBar
          containerStyle={styles.searchBar}
          round
          lightTheme
          placeholder={I18n.t('Search')}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(text) => handleSearch(fullData,text, filter)}
          value={search}
        />
        <View style={styles.filterSection}>
          <ModalSelector
            initValueTextStyle={{ color: "#fff" }}
            style={{ height: 50, flex: 1 }}
            data={talentFilter}
            initValue={talentFilter[0].label}
            onChange={(option) => {
              setFilter(option.label);
              handleSearch(fullData, search, option.label);
            }}
            cancelText={I18n.t('Cancel')}

          >
            <View style={styles.buttons}>
              <Text style={styles.text}>{filter}</Text>
              <FontAwesome name="caret-down" style={styles.icon} color={"#fff"} size={25} />
            </View>
            
          </ModalSelector>
          <View style={styles.button}>
            {/* <TouchableOpacity style={styles.touchableOpacity} onPress={() => navigation.navigate(I18n.t('Createchallenge'))}>
              <LinearGradient
                colors={["#02aab0", "#00cdac"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.signIn}
              >
                <MaterialCommunityIcons name="plus" color="#fff" size={40} />
              </LinearGradient>
            </TouchableOpacity> */}
          </View>
          <ModalSelector
            initValueTextStyle={{ color: "#fff" }}
            style={{ height: 50, flex: 1 }}
            data={talentSort}
            initValue={talentSort[0].label}
            onChange={(option) => handleSort(challenges, option.label)}
            cancelText={I18n.t('Cancel')}

          >
            <View style={styles.buttons}>
              <Text style={styles.text}>{sort}</Text>
              <FontAwesome name="caret-down" style={styles.icon} color={"#fff"} size={25} />
            </View>
          </ModalSelector>
        </View>
        <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
           }
          data={challenges}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          keyExtractor={(item) => item.uid}
        />
      </View>
    </LinearGradient>
  );
};

export default TalentChallenge;

const styles = StyleSheet.create({
  parent_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 2,
    alignSelf: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  button: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  signIn: {
    flexDirection: "row",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    elevation: 5,
  },
  touchableOpacity: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  filterSection: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  searchBar: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    borderTopWidth: 0,
    textAlign: 'center',
    marginBottom: -10
    
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  text: {
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
