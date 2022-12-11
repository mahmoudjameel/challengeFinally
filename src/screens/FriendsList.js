import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { Avatar, ListItem, SearchBar } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { ScrollView } from "react-native-gesture-handler";
import Fire from "../Api/Fire";
import firebase from "firebase/app";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { sendPushNotification } from "../util/extraMethods";
import I18n from '../screens/Translation/I18n';

const FriendsList = ({ route, navigation }) => {
  const { userId } = route.params;
  const [state, setState] = useState({ loading: false, search: "", data: [], friendReq: [], user: null });
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(true);

  const onRefresh = useCallback(() => {
    setRefreshing((refreshing) => true);
    getFriendsList();
  }, []);

  useEffect(() => {
    if (isMounted.current) getFriendsList();
    return () => (isMounted.current = false);
  }, []);

  //Get User's friends list
  const getFriendsList = async () => {
    let users = [];
    let reqs = [];
    const user = await Fire.getUser(Fire.uid);
    if (user) {
      user.friends.forEach(async (obj) => {
        const u = await Fire.getUser(obj);
        users.push(u);
        setState((prevState) => {
          return { ...prevState, data: users };
        });
      });

      user.FriendRequests.forEach(async (obj) => {
        const u = await Fire.getUser(obj);
        reqs.push(u);
        setState((prevState) => {
          return { ...prevState, friendReq: reqs };
        });
      });
    }
    setRefreshing((refreshing) => false);
    setState((prevState) => {
      return { ...prevState, loading: false, user: user };
    });
  };

  //Search function
  const handleSearch = (text) => {
    
    setState((prevState) => {
      return { ...prevState, search: text };
    });
  };

  //Reject user
  const rejectFriendRequest = async (user) => {
    if (isMounted.current) {
      await Fire.updateUser(Fire.uid, { FriendRequests: firebase.firestore.FieldValue.arrayRemove(user) });
      await Fire.updateUser(user, { PendingFriends: firebase.firestore.FieldValue.arrayRemove(Fire.uid) });
      await getFriendsList();
    }
  };

  //remove user from friend ist
  const acceptFriend = async (user) => {
    if (isMounted.current) {
      await Fire.updateUser(Fire.uid, { FriendRequests: firebase.firestore.FieldValue.arrayRemove(user) });
      await Fire.updateUser(Fire.uid, { friends: firebase.firestore.FieldValue.arrayUnion(user) });
      await Fire.updateUser(user, { PendingFriends: firebase.firestore.FieldValue.arrayRemove(Fire.uid) });
      await Fire.updateUser(user, { friends: firebase.firestore.FieldValue.arrayUnion(Fire.uid) });
      await getFriendsList();
    }
  };

  //Render Loading icon when loading more items in the list
  const renderLoading = () => {
    if (!state.loading) {
      return state.data.length == 0 ? (
        <Animatable.View animation="bounceIn" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ListItem.Title style={{ color: "#fff", fontSize: 30 }}>{I18n.t('Youdonothavefriends')}</ListItem.Title>
        </Animatable.View>
      ) : null;
    }

    return (
      <View>
        <ActivityIndicator style={{ marginTop: 20 }} animating color="#fff" size="large" />
      </View>
    );
  };

  //Search for friend and send request
  const searchFriend = async () => {
    setIsLoading((prev) => true);
    const res = await Fire.searchUser(state.search.trim());
    if (res) {
      if (
        
        res.settings.friends == I18n.t('both') ||
        (res.settings.friends == I18n.t('malesonly') && state.user.sex == I18n.t('male')) ||
        (res.settings.friends == I18n.t('femaleonly') && state.user.sex == I18n.t('female'))
      ) {
        await Fire.updateUser(state.user?.uid, { PendingFriends: firebase.firestore.FieldValue.arrayUnion(res.uid) });
        await Fire.updateUser(res.uid, { FriendRequests: firebase.firestore.FieldValue.arrayUnion(state.user?.uid) });
        sendPushNotification(
          res.token,
          `${I18n.t('friendfrom')} ${state.user?.username} `,
          `${I18n.t('Iaskedyou')} ${state.user?.username} ${I18n.t('Friendrequest')}`,
          ""
        );
        alert(I18n.t('Friendrequestsent'));
      } else {
        alert(`${I18n.t('Sorryacceptsrequestsfrom')} ${res.settings.friends} `);
      }
    }
    setIsLoading((prev) => false);
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.content}
      >
        <View style={styles.search}>
          <SearchBar
            containerStyle={styles.searchBar}
            round
            lightTheme
            placeholder={I18n.t('Findsomeonebyemail')}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(text) => handleSearch(text)}
            value={state.search}
          />

          {isLoading ? (
            <ActivityIndicator animating color="#fff" size="large" />
          ) : (
            <Icon style={styles.icon} name="account-plus" color="#fff" size={30} onPress={searchFriend} />
          )}
        </View>

        <View style={{ marginVertical: 10, alignItems: "center" }}>
          <ListItem.Title style={{ color: "#fff" }}>{I18n.t('Friendshiprequests')}</ListItem.Title>
        </View>
        <View style={{ marginBottom: 20, paddingBottom: 20, borderBottomWidth: 1 }}>
          {state.friendReq.length == 0 ? (
            <View style={{ marginVertical: 10, alignItems: "center" }}>
              <ListItem.Subtitle style={{ color: "#fff" }}>{I18n.t('NotFound')}</ListItem.Subtitle>
            </View>
          ) : (
            state.friendReq.map((user) => {
              return (
                <ListItem
                  key={user?.uid}
                  containerStyle={{ backgroundColor: "transparent", flexDirection: "row" }}
                  bottomDivider
                  onPress={() => navigation.push(I18n.t('Atachment'), { userId: user?.uid, type: 2 })}
                >
                  <Avatar rounded source={{ uri: user?.image }} />
                  <ListItem.Content>
                    <ListItem.Title style={{ color: "#fff" }}>{user?.username}</ListItem.Title>
                    <ListItem.Subtitle style={{ color: "#fff" }}>{user?.name}</ListItem.Subtitle>
                  </ListItem.Content>
                  <Animatable.View style={{ flexDirection: "row", color: "#fff" }} animation="bounceIn">
                    <Icon name="check" style={{color:'#39C1FC' , marginRight:20}}   color="#fff" size={27} onPress={() => acceptFriend(user?.uid)} />
                    <Icon name="close"  style={{color:'red'}} color="#fff" size={27} onPress={() => rejectFriendRequest(user?.uid)} />
                  </Animatable.View>
                  <ListItem.Chevron />
                </ListItem>
              );
            })
          )}
        </View>
        {renderLoading()}
        {state.data.map((user) => {
          return (
            <ListItem
              key={user?.uid}
              containerStyle={{ backgroundColor: "transparent" }}
              bottomDivider
              onPress={() => navigation.push(I18n.t('Atachment'), { userId: user?.uid, type: 2 })}
            >
              <Avatar rounded 
            // source={{ uri: user?.image }}
              source={user?.image ? { uri: user?.image || "" } : require("../../assets/cheering.png")}

              
              
              />
              <ListItem.Content style={{ borderBottomWidth: 0 }}>
                <ListItem.Title style={{ color: "#fff" }}>{user?.username}</ListItem.Title>
                <ListItem.Subtitle style={{ color: "#fff" }}>{user?.name}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
};

export default FriendsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bold: {
    fontWeight: "bold",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  searchBar: {
    flex: 1,
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    borderTopWidth: 0,
    alignItems:'center'
  },
  search: {
    width: "100%",
    flexDirection: "row",
  },
  icon: {
    marginTop: 15,
    marginHorizontal: 5,
    
  },
});
