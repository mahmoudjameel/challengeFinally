import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Text } from "react-native";
import { Avatar, ListItem, SearchBar } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { Header } from "react-native-elements";
import { Ionicons as Icons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import Fire from "../Api/Fire";
import I18n from '../screens/Translation/I18n';

const PrivateChatList = ({ navigation }) => {
  const [state, setState] = useState({ loading: true, search: "", data: [], fullData: [] });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing((refreshing) => true);
    getUserChatRooms();
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) getUserChatRooms();
    return () => (isMounted = false);
  }, []);

  //Get User's Chat list
  const getUserChatRooms = async () => {
    const chats = await Fire.getUserChatRooms();
    setState((prevState) => {
      return { ...prevState, fullData: chats, data: chats, loading: false };
    });
    setRefreshing((refreshing) => false);
  };

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
      let filteredData = state.fullData.filter((item) => {
        return item.userName.toLocaleLowerCase().includes(text);
      });
      setState((prevState) => {
        return { ...prevState, data: filteredData };
      });
    }
  };

  const renderLoading = () => {
    if (!state.loading) {
      return state.data.length == 0 ? (
        <Animatable.View animation="bounceIn" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ListItem.Title style={{ color: "#fff", fontSize: 25 }}>{I18n.t('Youdonthaveanyprivatechat')}</ListItem.Title>
        </Animatable.View>
      ) : null;
    }

    return (
      <View>
        <ActivityIndicator style={{ marginTop: 20 }} animating color={"#fff"} size={"large"} />
      </View>
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <Header
        containerStyle={styles.header}
        placement="right"
        leftComponent={
          <Icons.Button
            name="ios-menu"
            size={30}
            color="#fff"
            backgroundColor="transparent"
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          ></Icons.Button>
        }
        centerComponent={{ text: <Text style={{color: "#fff", fontWeight: "bold", fontSize: 20 }}>{I18n.t('privatechat')}</Text>, style: { color: "#fff", fontWeight: "bold", fontSize: 20 } }}
      />
      <View style={styles.content}>
        <SearchBar
          containerStyle={styles.searchBar}
          round
          lightTheme
          placeholder={I18n.t('Search')}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(text) => handleSearch(text)}
          onClear={(text) => handleSearch(text)}
          value={state.search}
        />
        <FlatList
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          data={state.data}
          ListFooterComponent={renderLoading}
          keyExtractor={(item) => item.roomId}
          renderItem={({ item }) => (
            <ListItem
              containerStyle={{ backgroundColor: "transparent" }}
              style={{ paddingHorizontal: 20 }}
              bottomDivider
              onPress={() =>
                navigation.navigate("FriendsFavorite", {
                  screen: I18n.t('privatechatpage'),
                  params: {
                    roomId: item.roomId,
                    userImage: item.userImage,
                    userName: item.userName,
                    userId: item.userId,
                  },
                })
              }
            >
              <Avatar rounded size={40} source={{ uri: item.userImage }} />
              <ListItem.Content style={{ flexDirection: "row", alignItems: "center" }}>
                <ListItem.Title style={{ flex: 1, color: "#fff" }}>{item.userName}</ListItem.Title>
                {item.unseen > 0 ? <ListItem.Subtitle style={styles.unseen}>{item.unseen}</ListItem.Subtitle> : null}
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )}
        />
      </View>
    </LinearGradient>
  );
};

export default PrivateChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bold: {
    fontWeight: "bold",
  },
  unseen: {
    borderRadius: 50,
    backgroundColor: "#00cdac",
    color: "#fff",
    padding: 5,
  },
  searchBar: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
  },
});
