import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Text, ActivityIndicator, FlatList } from "react-native";
import { Avatar, ListItem, AirbnbRating } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import StarRating from "../../components/StarRating";
import { displayMessage } from "../../util/extraMethods";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Constant from "../../util/constants";
import PlayerCard from "../../components/PlayerCard";
import Fire from "../../Api/Fire";
import Dialog, {
  DialogFooter,
  DialogButton,
  SlideAnimation,
  DialogContent,
  DialogTitle,
} from "react-native-popup-dialog";
import I18n from '../Translation/I18n';


const { height, width } = Dimensions.get("screen");

const ClubHomeScreen = ({ route, navigation }) => {
  const { clubId } = route.params;
  const isMounted = useRef(true);
  const [notification, setNotification] = useState(false);
  const [state, setState] = useState({ loading: true, showDialog: false, item: null, rating: 0, user: null });
  const [club, setClub] = useState({ uid: null, players: [], image: "", name: "", rating: 0, reviews: [], users: [] });

  //Get Club
  useEffect(() => {
    if (isMounted.current) {
      getTeam(clubId);
      getUserInformation();
    }

    // Stop listening for updates
    return () => {
      isMounted.current = false;
    };
  }, []);

  //Get User's favorite list
  const getUserInformation = async () => {
    try {
      const response = await Fire.getUser(Fire.uid);
      if (response) {
        setState({ ...state, user: response });
        Object.entries(response.notifications).forEach((notification) => {
          clubId == notification[0] ? setNotification((notification) => notification[1]) : null;
        });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const getTeam = async (id) => {
    setState((prevState) => {
      return { ...prevState, loading: true };
    });
    try {
      let response = await fetch(`${Constant.API_ENDPOINT}Teams&teamId=${id}&APIkey=${Constant.API_KEY}`);
      let json = await response.json();
      Object.values(json.result).forEach((team) => {
        if (isMounted.current) {
          //Get Team / Club details
          Fire.getClub(team, (clubInfo) => {
            setClub((prevState) => ({
              ...prevState,
              uid: clubId,
              name: team.team_name,
              image: team.team_logo,
              rating: clubInfo != null ? clubInfo.rating : 0,
              reviews: clubInfo != null ? clubInfo.reviews || [] : [],
            }));
          });

          //Get All Players
          let players = [];
          Object.values(team.players).forEach(async (player) => {
            const playerInfo = await Fire.getPlayer(`${id}`, player);
            players.push({
              uid: `${player.player_key}`,
              name: player.player_name,
              country: player.player_country,
              type: player.player_type,
              goals: player.player_goals,
              number: player.player_number,
              rating: playerInfo != null ? playerInfo.rating : 0,
              reviews: playerInfo != null ? playerInfo.reviews || [] : [],
            });
            setClub((prevState) => ({ ...prevState, players: players }));
          });
        }
      });
    } catch (error) {
      alert(error.message);
    }
    setState((prevState) => {
      return { ...prevState, loading: false };
    });
  };

  //Update club notification
  const updateClubNotification = async () => {
    if (isMounted.current) {
      const response = await Fire.updateUser(state.user.uid, { ["notifications." + clubId]: !notification });
      if (response) {
        setNotification((notification) => !notification);
        displayMessage(notification ? I18n.t('Notificationscancelled') : I18n.t('Notificationsenabled'));
      }
    }
  };

  //Update User
  const updateUser = async () => {
    //Check if user already rated or not
    if (isMounted.current) {
      if (state.item.reviews != null) {
        if (state.item.reviews.includes(state.user.uid)) {
          displayMessage(I18n.t('Youhavealreadyrated'));
          setState({ ...state, showDialog: false });
          return;
        }
      }

      //Calculate ratings and reviews
      var ratings = state.item.reviews ? (state.item.rating + state.rating) / 2 : state.rating;
      var review = state.item.reviews ? [...state.item.reviews, state.user.uid] : [state.user.uid];

      //Update Club
      if (`${clubId}` == state.item.uid) {
        return await Fire.updateClub(`${clubId}`, { rating: ratings, reviews: review }, I18n.t('Successfullyevaluated'));
      }

      await Fire.updatePlayer(`${clubId}`, `${state.item.uid}`, { rating: ratings, reviews: review });

      getTeam(clubId);
      setState({ ...state, showDialog: false });
    }
  };

  const renderDialog = () => {
    return (
      <Dialog
        visible={state.showDialog}
        dialogStyle={{ backgroundColor: "#02aab0", width: width / 1.5 }}
        dialogTitle={<DialogTitle style={{ backgroundColor: "#02aab0" }} align={"center"} title={I18n.t('addReview')} />}
        dialogAnimation={new SlideAnimation({ slideFrom: "bottom" })}
        footer={
          <DialogFooter>
            <DialogButton
              align="center"
              text={I18n.t('Submit')}
              onPress={() => {
                setState({ ...state, showDialog: false });
                updateUser();
              }}
            />
          </DialogFooter>
        }
        onTouchOutside={() => setState({ ...state, showDialog: false })}
      >
        <DialogContent style={{ height: height / 4, backgroundColor: "#02aab0", alignItems: "center" }}>
          <View style={{ margin: 20 }}>
            <AirbnbRating
              count={5}
              reviews={[I18n.t('Verybad'),I18n.t('Bad'),I18n.t('good'),I18n.t('verygood'),I18n.t('Excellent'),]}
              defaultRating={state.item != null ? state.item.rating : 0}
              onFinishRating={(rating) => setState({ ...state, rating: rating })}
              size={30}
            />
          </View>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={styles.panelButtonTitle}> {I18n.t('AudienceRating')} </Text>
            <StarRating
              ratings={state.item != null ? state.item.rating : 0}
              reviews={state.item != null ? (state.item.reviews != null ? state.item.reviews.length : 0) : 0}
            />
          </View>
        </DialogContent>
      </Dialog>
    );
  };

  const renderHeader = () => {
    return (
      <View>
        <View style={styles.userInfoSection}>
          <View style={{ justifyContent: "center", alignItems: "center", marginTop: 15 }}>
            <Avatar size={150} source={{ uri: club.image }} />
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <ListItem.Title style={styles.title}>{club.name}</ListItem.Title>
              <TouchableOpacity
                onPress={() => setState({ ...state, showDialog: true, item: club })}
                style={{ marginTop: 15, marginBottom: 5 }}
              >
                <StarRating color="#fff" big={true} ratings={club.rating} reviews={club.reviews.length} />
              </TouchableOpacity>
            </View>
            <Icon.Button
              name={notification ? "bell" : "bell-outline"}
              style={{ padding: 10 }}
              color="#fff"
              backgroundColor="transparent"
              size={40}
              onPress={() => updateClubNotification()}
            />
          </View>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <ListItem.Title style={styles.sub_title}>{I18n.t('Thereisnoinplayer')}</ListItem.Title>
        </View>
      </View>
    );
  };

  const renderEmpty = () => {
    if (state.loading) return null;

    return (
      <Animatable.View animation="bounceIn" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ListItem.Title style={{ color: "#fff", fontSize: 30 }}>{I18n.t('Thereisnoinplayer')}</ListItem.Title>
      </Animatable.View>
    );
  };

  //Display loader while getting data from database
  const renderFooter = () => {
    if (!state.loading) return null;

    return (
      <View>
        <ActivityIndicator animating color="#fff" size="large" />
      </View>
    );
  };

  const renderPlayer = ({ item }) => {
    return (
      <PlayerCard item={item} type="player" onPress={() => setState({ ...state, showDialog: true, item: item })} />
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <Animatable.View animation="fadeInUpBig">
        <FlatList
          ListFooterComponent={renderFooter}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          data={club.players}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.uid}
        />
        {renderDialog()}
      </Animatable.View>
    </LinearGradient>
  );
};

export default ClubHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    marginTop: Constants.statusBarHeight,
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 5,
    color: "gold",
  },
  sub_title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    color: "#fff",
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
  panelButtonTitle: {
    margin: 5,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
