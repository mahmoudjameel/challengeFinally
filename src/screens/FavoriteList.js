import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { Avatar, ListItem, SearchBar } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import Fire from "../Api/Fire";
import I18n from '../screens/Translation/I18n';

const FavoriteList = ({ route, navigation }) => {
  const { userId } = route.params;
  const [state, setState] = useState({ loading: false, search: "", data: [], fullData: [] });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing((refreshing) => true);
    getFavList();
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) getFavList();
    return () => (isMounted = false);
  }, []);

  //Get User's favorite list
  const getFavList = async () => {
    let users = [];
    const user = await Fire.getUser(Fire.uid);
    if (user) {
      user.favorite.forEach(async (obj) => {
        const u = await Fire.getUser(obj);
        users.push(u);
        setState((prevState) => {
          return { ...prevState, fullData: users, data: users };
        });
      });
    }
    setRefreshing((refreshing) => false);
    setState((prevState) => {
      return { ...prevState, loading: false };
    });
  };

  //Search function
  const handleSearch = (text) => {
    setState((prevState) => {
      return { ...prevState, search: text };
    });

    if (text == "") {
      setState((prevState) => {
        return { ...prevState, data: state.fullData };
      });

      return;
    } else {
      let filteredData = state.fullData.filter(function (item) {
        return item.username.toLocaleLowerCase().includes(text.toLocaleLowerCase());
      });
      setState((prevState) => {
        return { ...prevState, data: filteredData };
      });
    }
  };

  //Render Loading icon when loading more items in the list
  const renderLoading = () => {
    if (!state.loading) return null;
    return (
      <View>
        <ActivityIndicator style={{ marginTop: 20 }} animating color="#fff" size="large" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (state.loading) return null;
    return (
      <Animatable.View animation="bounceIn" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ListItem.Title style={{ color: "#fff", fontSize: 30 }}>{I18n.t('Youdonhavanyfavuorites')}</ListItem.Title>
      </Animatable.View>
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <View style={styles.content}>
           <SearchBar
            containerStyle={styles.searchBar}
            round
            lightTheme
            placeholder={I18n.t('Search')}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(text) => handleSearch(text)}
            value={state.search}
          />
        <FlatList
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListFooterComponent={renderLoading}
          ListEmptyComponent={renderEmpty}
          data={state.data}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <ListItem
              containerStyle={{ backgroundColor: "transparent" }}
              bottomDivider
              onPress={() => navigation.push(I18n.t('Atachment'), { userId: item.uid, type: 2 })}
            >
              <Avatar rounded source={{ uri: item.image }} />
              <ListItem.Content style={{ borderBottomWidth: 0 }}>
                <ListItem.Title style={{ color: "#fff" }}>{item.username}</ListItem.Title>
                <ListItem.Subtitle style={{ color: "#fff" }}>{item.name}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )}
        />
      </View>
    </LinearGradient>
  );
};

export default FavoriteList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  header: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  searchBar: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
});
