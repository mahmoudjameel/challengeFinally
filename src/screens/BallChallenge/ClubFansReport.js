import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { Avatar, ListItem, SearchBar } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import Fire from "../../Api/Fire";
import I18n from '../Translation/I18n';

const ClubFansReport = ({ route, navigation }) => {
  const { clubId, matchId } = route.params;
  const [data, setData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  //Get Club fans
  useEffect(() => {
    let isMounted = true;

    const subsciber =
      matchId != null
        ? Fire.getMatchReport(`${matchId}`, (usersList) => {
            let users = [];
            usersList.forEach((user) => {
              if (user != Fire.uid) {
                (async () => {
                  const u = await Fire.getUser(user);
                  users.push(u);
                  if (isMounted) {
                    setData((prev) => users);
                    setFullData((prev) => users);
                  }
                })();
              }
            });
          })
        : Fire.getClubUsers(`${clubId}`, (usersList) => {
          let users = [];
          for (const user of usersList) {
            if (user != Fire.uid) {
              (async () => {
                const u = await Fire.getUser(user);
                if (!u) return;
                users.push(u);
                if (isMounted) {
                  setData((prev) => users);
                  setFullData((prev) => users);
                }
              })();
            }
          }

          });

    setLoading((loading) => false);

    // Stop listening for updates
    return () => {
      subsciber != null ? subsciber.off() : null;
      isMounted = false;
    };
  }, []);

  //Search Functions
  const handleSearch = (text) => {
    setSearch((prev) => text);

    if (text.trim() == "") return setData(fullData);

    let filteredData = fullData.filter((user) => {
      return user.username.toLocaleLowerCase().includes(text);
    });
    setData(filteredData);
  };

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View style={{ paddingVertical: 20, borderTopWidth: 1, borderColor: "#CED0CE" }}>
        <ActivityIndicator animating color="#fff" size="large" />
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <ListItem
        containerStyle={{ backgroundColor: "transparent" }}
        bottomDivider
        onPress={() =>
          navigation.navigate("FriendsFavorite", {
            screen: I18n.t('Atachment'),
            params: { userId: item.uid, type: 2 },
          })
        }
      >
        <Avatar size={40} rounded source={{ uri: item.image }} />
        <ListItem.Content style={styles.itemContent}>
          <View style={styles.info}>
            <ListItem.Title style={styles.white}>{item.username}</ListItem.Title>
            <ListItem.Title style={styles.white}>{item.country}</ListItem.Title>
          </View>
        </ListItem.Content>
      </ListItem>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <Animatable.View animation="bounceIn" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ListItem.Title style={[styles.white, { fontSize: 30 }]}>{I18n.t('Therearenofans')}</ListItem.Title>
      </Animatable.View>
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <SearchBar
        containerStyle={styles.header}
        round
        lightTheme
        placeholder={I18n.t('Search')}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(text) => handleSearch(text)}
        onClear={(text) => handleSearch(text)}
        value={search}
      />
      <View style={styles.text_container}>
        <Text style={styles.text}>{data.filter((user) => user.sex == I18n.t('male')).length}</Text>
        <Text style={styles.text}>{I18n.t('numberofmales')}</Text>
        {console.log(data)}
      </View>
      <View style={styles.text_container}>
        <Text style={styles.text}>{data.filter((user) => user.sex == I18n.t('female')).length}</Text>
        <Text style={styles.text}>{I18n.t('numberoffemales')}</Text>
      </View>
      <Animatable.View style={styles.list} animation="bounceIn">
        <FlatList
          data={data}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          keyExtractor={(item) => item.uid}
        />
      </Animatable.View>
    </LinearGradient>
  );
};

export default ClubFansReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  list: {
    flex: 1,
  },
  text: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
  },
  text_container: {
    width: "100%",
    marginTop: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  header: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  itemContent: {
    borderBottomWidth: 0,
    alignItems: "center",
    flexDirection: "row",
  },
  info: {
    flex: 1,
    alignItems: "flex-start",
  },
  white: {
    color: "#fff",
  },
});
