import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Avatar, Title, Caption, Text, TouchableRipple, Paragraph } from "react-native-paper";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import { SendGiftDialog } from "../../components/SendGiftsDialog";
import { Header } from "react-native-elements";
import Fire from "../../Api/Fire";
import firebase from "firebase/app";
import { displayMessage, sendPushNotification } from "../../util/extraMethods";
import { CommonActions } from "@react-navigation/native";
import ModalSelector from "react-native-modal-selector";
import Dialog, {
  DialogFooter,
  DialogButton,
  SlideAnimation,
  DialogContent,
  DialogTitle,
} from "react-native-popup-dialog";
import I18n from '../Translation/I18n';


const ProfileScreen = ({ route, navigation }) => {
  const { type, userId } = route.params;
  const [otheruser, setOtherUser] = useState(null);
  const [dialogState, setDialogState] = useState(false);
  const [teamDialogState, setTeamDialogState] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [favLocalTeam, setFavLocalTeam] = useState({ key: "", label: "" });
  const [favInterTeam, setFavInterTeam] = useState({ key: "", label: "" });
  const isMounted = useRef(true);
  const [user, setUser] = useState(null || {});
  useEffect(() => {
    getUserInformation();
    return () => (isMounted.current = false);
  }, []);

  //Get User Information
  const getUserInformation = async () => {
    if (isMounted.current) {
      if (type === 1) return getUser();

      getUser();
      getOtherUser();
      if (!user) return;
      if (user?.settings?.profile != I18n.t('friendsonly')) return;
      if (user.friends.includes(Fire.uid)) return;

      navigation.goBack();
      alert(I18n.t('Sorrycanlist'));
    }
  };

  const getUser = async () => {
    const user = await Fire.getUser(userId);
    setUser(user);

    //get teams
    const clubs = await Fire.getAllClubsDropList();
    setClubs(clubs);

    let favLocalTeam = { key: "", label: user.favLocalTeam };
    let favInterTeam = { key: "", label: user.FavInterTeam };

    clubs.forEach((club) => {
      if (club.key === user.favLocalTeam) favLocalTeam = club;
      if (club.key === user.FavInterTeam) favInterTeam = club;
    });

    setFavLocalTeam(favLocalTeam);
    setFavInterTeam(favInterTeam);
  };

  const getOtherUser = async () => {
    const user = await Fire.getUser(Fire.uid);
    setOtherUser(user);
  };

  //add user to friends list
  const sendFriendRequest = async () => {
    if (isMounted.current) {
      if (
        otheruser.settings.friends == I18n.t('both') ||
        (otheruser.settings.friends == I18n.t('malesonly') && user.sex == I18n.t('male')) ||
        (otheruser.settings.friends == I18n.t('femaleonly') && user.sex == I18n.t('female'))
      ) {
        await Fire.updateUser(otheruser.uid, { PendingFriends: firebase.firestore.FieldValue.arrayUnion(user.uid) });
        await Fire.updateUser(user.uid, { FriendRequests: firebase.firestore.FieldValue.arrayUnion(otheruser.uid) });
        sendPushNotification(
          user.token,
          `${I18n.t('friendfrom')} ${user.username} `,
          `${I18n.t('Friendrequest')} ${user.username}  ${I18n.t('Friendrequest')}`,
          ""
        );
      } else {
        alert(`${I18n.t('Sorryacceptsrequestsfrom')} ${otheruser.settings.friends} `);
      }
      getUser();
      getOtherUser();
    }
  };

  //remove user from friend ist
  const unFriend = async () => {
    if (isMounted.current) {
      await Fire.updateUser(otheruser.uid, { friends: firebase.firestore.FieldValue.arrayRemove(user.uid) });
      await Fire.updateUser(user.uid, { friends: firebase.firestore.FieldValue.arrayRemove(otheruser.uid) });
      getUser();
      getOtherUser();
    }
  };

  //remove user from friend ist
  const acceptFriend = async () => {
    if (isMounted.current) {
      await Fire.updateUser(otheruser.uid, { friends: firebase.firestore.FieldValue.arrayUnion(user.uid) });
      await Fire.updateUser(user.uid, { friends: firebase.firestore.FieldValue.arrayUnion(otheruser.uid) });
      await Fire.updateUser(otheruser.uid, { FriendRequests: firebase.firestore.FieldValue.arrayRemove(user.uid) });
      await Fire.updateUser(user.uid, { PendingFriends: firebase.firestore.FieldValue.arrayRemove(otheruser.uid) });
      getUser();
      getOtherUser();
    }
  };

  //add user to favorite list
  const addToFavorite = async () => {
    if (isMounted.current) {
      await Fire.updateUser(otheruser.uid, { favorite: firebase.firestore.FieldValue.arrayUnion(user.uid) });
      getOtherUser();
    }
  };

  //remove user from favorite list
  const removeFromFavorite = async () => {
    if (isMounted.current) {
      await Fire.updateUser(otheruser.uid, { favorite: firebase.firestore.FieldValue.arrayRemove(user.uid) });
      getOtherUser();
    }
  };

  //remove user from friends req
  const unSendFriendRequest = async () => {
    if (isMounted.current) {
      await Fire.updateUser(otheruser.uid, { PendingFriends: firebase.firestore.FieldValue.arrayRemove(user.uid) });
      await Fire.updateUser(user.uid, { FriendRequests: firebase.firestore.FieldValue.arrayRemove(otheruser.uid) });
      getUser();
      getOtherUser();
    }
  };

  //Reject user
  const rejectFriendRequest = async () => {
    if (isMounted.current) {
      await Fire.updateUser(otheruser.uid, { FriendRequests: firebase.firestore.FieldValue.arrayRemove(user.uid) });
      await Fire.updateUser(user.uid, { PendingFriends: firebase.firestore.FieldValue.arrayRemove(otheruser.uid) });
      getUser();
      getOtherUser();
    }
  };

  const startChat = async () => {
    //check if user disabled chat
    if (user.settings.chat) return alert(I18n.t('Sorrytheuseconversations'));

    //get balls point
    const balls = await Fire.getAllBalls(otheruser.subscription);

    //update user balls points
    const response = await Fire.updateUser(otheruser.uid, {
      silverBalls: firebase.firestore.FieldValue.increment(-balls.openPrivateChatWritten),
    });

    //go to chat screen
    if (response) {
      navigation.navigate("FriendsFavorite", {
        screen: I18n.t('privatechatpage'),
        params: { userId: user.uid, userName: user.username, userImage: user?.image, roomId: null },
      });
    }
  };

  //Go to edit profile screen
  const goToEditProfile = () => {
    if (user) navigation.navigate("FriendsFavorite", { screen: I18n.t('UpdateProfile'), params: { userId: user.uid } });
  };

  //change user's fav local & inter team
  const changeTeams = async () => {
    setTeamsLoading((prev) => true);
    const response = await Fire.updateUser(user.uid, {
      favLocalTeam: favLocalTeam.key,
      FavInterTeam: favInterTeam.key,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
    });

    if (!response) return displayMessage(I18n.t('Errors'));

    //Update Club Users
    const res = await Fire.updateClubUsers(favLocalTeam.key, user.uid);

    if (!res) return displayMessage(I18n.t('Errors'));

    //Update Club Users
    const res2 = await Fire.updateClubUsers(favInterTeam.key, user.uid);

    if (!res2) return displayMessage(I18n.t('Errors'));

    displayMessage(I18n.t('Teamsupdatedsuccessfully'));
    getUser();
    setTeamsLoading((prev) => false);
  };

  // check if today is the last day of the month
  const getDiff = () => {
    if (user != null) {
      const diffInMs = new Date() - (user.lastUpdated ? user.lastUpdated.toDate() : new Date());
      return diffInMs / (1000 * 60 * 60 * 24);
    }
    return 0;
  };

  //talent options dialog footer
  const renderFooter = () => {
    return (
      <DialogFooter>
        {teamsLoading ? (
          <View style={{ width: "100%", alignItems: "center", paddingVertical: 10 }}>
            <ActivityIndicator animating color="#fff" size="large" />
          </View>
        ) : (
          <>
            <DialogButton align="center" textStyle={{ color: "white" }} text={I18n.t('Submit')} onPress={changeTeams} />
            <DialogButton
              align="center"
              textStyle={{ color: "red" }}
              text={I18n.t('Cancel')}
              onPress={() => setTeamDialogState(false)}
            />
          </>
        )}
      </DialogFooter>
    );
  };

  //talent options dialog
  const renderDialog = () => (
    <Dialog
      visible={teamDialogState}
      onTouchOutside={() => setTeamDialogState(false)}
      dialogStyle={{ backgroundColor: "#02aab0", width: "80%" }}
      dialogTitle={<DialogTitle style={{ backgroundColor: "#02aab0" }} align="center" title={I18n.t('changedifference')} />}
      dialogAnimation={new SlideAnimation({ slideFrom: "bottom" })}
      footer={renderFooter()}
    >
      <DialogContent>
        <ScrollView contentContainerStyle={styles.dialogContent}>
          <Text style={styles.heading}>{I18n.t('yourfavoritelocalteam')}</Text>
          <View style={styles.action}>
            <ModalSelector
              initValueTextStyle={{ color: "#000" }}
              style={{ height: 30, width: "100%" }}
              data={clubs}
              initValue={I18n.t('yourfavoritelocalteam')}
              onChange={(option) => setFavLocalTeam(option)}
              cancelText={I18n.t('cancel')}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.data}>{favLocalTeam.label}</Text>
              </View>
            </ModalSelector>
          </View>
          <Text style={styles.heading}>{I18n.t('yourfavoriteglobalteam')}</Text>
          <View style={styles.action}>
            <ModalSelector
              initValueTextStyle={{ color: "#000" }}
              style={{ height: 30, width: "100%" }}
              data={clubs}
              initValue={I18n.t('yourfavoriteglobalteam')}
              onChange={(option) => setFavInterTeam(option)}
              cancelText={I18n.t('cancel')}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.data}>{favInterTeam.label}</Text>
              </View>
            </ModalSelector>
          </View>
        </ScrollView>
      </DialogContent>
    </Dialog>
  );

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <Header
        containerStyle={{ backgroundColor: "transparent", borderBottomWidth: 0 }}
        placement="right"
        leftComponent={
          <Ionicons.Button
            name="md-arrow-back"
            size={30}
            color="#fff"
            backgroundColor="transparent"
            onPress={() => navigation.dispatch({ ...CommonActions.goBack(), source: route.key })}
          />
        }
        rightComponent={
          type != 2 ? (
            <MaterialCommunityIcons.Button
              name="account-edit"
              size={30}
              color="#fff"
              backgroundColor="transparent"
              onPress={goToEditProfile}
            />
          ) : null
        }
        centerComponent={{
          text: I18n.t('Atachment'),
          style: { color: "#fff", fontWeight: "bold", fontSize: 20, marginTop: 10 },
        }}
      />
      <ScrollView>
        <Animated.View animation="fadeInUpBig">
          <View style={styles.userInfoSection}>
            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 15 }}>
              <Avatar.Image
                source={{ uri: user ? user?.image : "https://api.adorable.io/avatars/80/abott@adorable.png" }}
                size={100}
              />
              <View style={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
                <Title style={[styles.title, { marginTop: 15, marginBottom: 15, color: "#fff" }]}>
                  {user ? user.username : "????"}
                </Title>
                <Caption style={[styles.caption, { color: "#fff", marginBottom: 15 }]}>
                  {user
                    ? user.type == "Adult"
                      ? type == 1
                        ? user.name || "????"
                        : user?.settings.hideName
                        ? "????"
                        : user.name
                      : null
                    : "????"}
                </Caption>
                <Caption
                  style={[
                    styles.caption,
                    {
                      color: user
                        ? user.subscription == "Silver"
                          ? "#c0c0c0"
                          : user.subscription == "Gold"
                          ? "#ffd700"
                          : "#cd7f32"
                        : "#cd7f32",
                      marginBottom: 15,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  {I18n.t('Subtype')}
                  {user
                    ? user.subscription == "Silver"
                      ? I18n.t('silver')
                      : user.subscription == "Gold"
                      ? I18n.t('golden')
                      : I18n.t('bronze')
                    : I18n.t('bronze')}
                </Caption>
                {type == 1 ? null : (
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      margin: 20,
                    }}
                  >
                    {otheruser ? (
                      otheruser.friends.includes(userId) ? (
                        <Animatable.View animation="bounceIn">
                          <MaterialCommunityIcons name="account-check" color="#fff" size={30} onPress={unFriend} />
                        </Animatable.View>
                      ) : otheruser.FriendRequests.includes(userId) ? (
                        <Animatable.View animation="bounceIn">
                          <MaterialCommunityIcons name="check" color='#39C1FC' size={30} onPress={acceptFriend} />
                          <MaterialCommunityIcons name="close" color='red'size={30} onPress={rejectFriendRequest} />
                        </Animatable.View>
                      ) : otheruser.PendingFriends.includes(userId) ? (
                        <Animatable.View animation="bounceIn">
                          <MaterialCommunityIcons
                            name="account-clock"
                            color="#fff"
                            size={30}
                            onPress={unSendFriendRequest}
                          />
                        </Animatable.View>
                      ) : (
                        <Animatable.View animation="bounceIn">
                          <MaterialCommunityIcons
                            name="account-plus"
                            color="#fff"
                            size={30}
                            onPress={sendFriendRequest}
                          />
                        </Animatable.View>
                      )
                    ) : null}
                    {otheruser ? (
                      otheruser.favorite.includes(userId) ? (
                        <Animatable.View animation="bounceIn">
                          <MaterialCommunityIcons name="heart" color="#FF5757" size={30} onPress={removeFromFavorite} />
                        </Animatable.View>
                      ) : (
                        <Animatable.View animation="bounceIn">
                          <MaterialCommunityIcons name="heart" color="#fff" size={30} onPress={addToFavorite} />
                        </Animatable.View>
                      )
                    ) : null}
                    <Animatable.View animation="bounceIn">
                      <MaterialCommunityIcons name="gift" color="#fff" size={30} onPress={() => setDialogState(true)} />
                    </Animatable.View>
                    <Animatable.View animation="bounceIn">
                      <MaterialCommunityIcons name="chat" color="#fff" size={30} onPress={startChat} />
                    </Animatable.View>
                  </View>
                )}
              </View>
            </View>
          </View>
          <View style={styles.row2}>
              <TouchableRipple
                style={styles.icon}
              >
                <View style={styles.section}>
                  <Caption style={styles.caption}> {I18n.t('friend')} </Caption>
                  <Paragraph style={[styles.paragraph, styles.caption]}>
                    {user.friends ? user.friends.length || 0 : 0}
                  </Paragraph>
                </View>
              </TouchableRipple>
              <TouchableRipple
                style={styles.icon}
              >
                <View style={styles.section}>
                  <Caption style={styles.caption}> {I18n.t('afan')} </Caption>
                  <Paragraph style={[styles.paragraph, styles.caption]}>
                    {user.favorite ? user.favorite.length || 0 : 0}
                  </Paragraph>
                </View>
              </TouchableRipple>
            </View>

          <View style={styles.infoBoxWrapper}>
            <View
              style={[styles.infoBox, { borderRightColor: "#dddddd", borderRightWidth: 1, backgroundColor: "#C0C0C0" }]}
            >
              <Title style={{ color: "#fff" }}>{user ? user.silverBalls : "????"}</Title>
              <Caption style={{ color: "#fff" }}>{I18n.t('silverballs')}</Caption>
            </View>
            <View style={[styles.infoBox, { backgroundColor: "#FFD752" }]}>
              <Title>{user ? user.goldBalls : "????"}</Title>
              <Caption>{I18n.t('goldenballs')}</Caption>
            </View>
          </View>

          <View style={styles.userInfoSection}>
            {type == 1 ? (
              user ? (
                user.type == "Adult" ? (
                  <View style={styles.row}>
                    <MaterialCommunityIcons name="map-marker-radius" color={"#fff"} size={20} />
                    <Text style={{ color: "#fff", marginLeft: 20 }}>
                      {type == 1
                        ? user
                          ? user.type == "Adult"
                            ? `${user.city} , ${user.country}`
                            : null
                          : "????"
                        : user
                        ? user?.settings?.hideAddress
                          ? "????"
                          : `${user.city} , ${user.country}`
                        : "????"}
                    </Text>
                  </View>
                ) : null
              ) : null
            ) : null}

            <View style={styles.row}>
              <MaterialCommunityIcons name="phone" color={"#fff"} size={20} />
              <Text style={{ color: "#fff", marginLeft: 20 }}>
                {type == 1
                  ? user
                    ? user.phoneNumber
                    : "????"
                  : user
                  ? user?.settings?.hidePhone
                    ? "????"
                    : user.phoneNumber
                  : "????"}
              </Text>
            </View> 
            <View style={styles.row}>
              <MaterialCommunityIcons name="email" color={"#fff"} size={20} />
              <Text style={{ color: "#fff", marginLeft: 20 }}>
                {type == 1
                  ? user
                    ? user.email
                    : "????"
                  : user
                  ? user?.settings?.hideEmail
                    ? "????"
                    : user.email
                  : "????"}
              </Text>
            </View>
          </View>
            <View style={[styles.menuWrapper, {marginTop:-30}]}>
            <Text style={styles.heading}>{I18n.t('Quickoverview')}</Text>
            <Text style={styles.subheading}>
               {type == 1 ? (user ? user.view : "????") : user ? (user?.settings?.hideView ? "????" : user.view) : "????"} 
            </Text>
          </View>

          <View style={[styles.menuWrapper, { borderTopWidth: 1, borderTopColor: "grey", paddingVertical: 10 }]}>
            {type === 1 ? <Text style={styles.small}>{I18n.t('Youcanchangeyourfavoriteteameverydays')}</Text> : null}
            {type === 1 && getDiff() >= 30 ? (
              <MaterialCommunityIcons
                name="square-edit-outline"
                color="#fff"
                size={30}
                onPress={() => setTeamDialogState(true)}
              />
            ) : null}
            <Text style={styles.heading}>{I18n.t('yourfavoritelocalteam')}</Text>
            <Text style={styles.subheading}>{favLocalTeam.label}</Text>
            <Text style={styles.heading}>{I18n.t('yourfavoriteglobalteam')}</Text>
            <Text style={styles.subheading}>{favInterTeam.label}</Text>
          </View>
        </Animated.View>
        {renderDialog()}
        <SendGiftDialog otheruser={user} visible={dialogState} onPressOutside={() => setDialogState(false)} />
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  userInfoSection: {
    marginVertical: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  row2: {
    marginBottom: 30,
    justifyContent: "space-evenly",
    flexDirection: "row",
     marginTop:-20
  },
  infoBoxWrapper: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "25%",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
  heading: {
    color: "gold",
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 10,
  },
  subheading: {
    color: "#fff",
    marginTop: 10,
  },
  small: {
    color: "#fff",
    fontSize: 12,
    marginVertical: 10,
  },
  action: {
    flexDirection: "row",
    marginTop: 20,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
  },
  data: {
    flex: 1,
    padding: 5,
    height: 30,
    color: "#fff",
  },
  dialogContent: {
    backgroundColor: "#02aab0",
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 400,
  },
  icon: {
    backgroundColor: "white",
    marginHorizontal: 10,
    borderRadius: 10,
  },
  caption: {
    color: "#000",
    fontSize: 14,
    lineHeight: 14,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    margin: 8,
  },
});
