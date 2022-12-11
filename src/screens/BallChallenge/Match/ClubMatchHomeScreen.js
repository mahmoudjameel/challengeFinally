import React, { useState, useEffect, useRef, useCallback } from "react";
import StarRating from "../../../components/StarRating";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { convertArabicNumbers, displayMessage } from "../../../util/extraMethods";
import Constants from "expo-constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar, ListItem, AirbnbRating } from "react-native-elements";
import * as Constant from "../../../util/constants";
import FootballField from "../../../components/FootballField";
import Fire from "../../../Api/Fire";
import { formatMatchTimer } from "../../../util/extraMethods";
import { View, StyleSheet, Text, ActivityIndicator, Dimensions, RefreshControl, TextInput } from "react-native";
import Dialog, {
  DialogFooter,
  DialogButton,
  SlideAnimation,
  DialogContent,
  DialogTitle,
} from "react-native-popup-dialog";
import I18n from '../../../screens/Translation/I18n';

const { height, width } = Dimensions.get("screen");

const ClubMatchHomeScreen = ({ route, navigation }) => {
  const { matchId, clubId } = route.params;
  const [club, setClub] = useState(null);
  const [enemyClub, setEnemyClub] = useState(null);
  const [timer, setTimer] = useState(0);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balls, setBalls] = useState("0");
  const [user, setUser] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [state, setState] = useState({ showDialog: false, showBallsDialog: false, item: null, id: "", rating: 0 });
  const interval = useRef(null);

  const onRefresh = useCallback(() => {
    setRefreshing((refreshing) => true);
    getMatch();
    getUser();
  }, []);

  //Get Club , EnenmyClub, and match  data
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getMatch();
      getUser();
    }
    // Stop listening for updates
    return () => {
      mounted = false;
      interval.current != null ? clearInterval(interval.current) : null;
    };
  }, []);

  const getUser = async () => {
    const user = await Fire.getUser(Fire.uid);
    setUser((u) => user);
  };

  const renderLoading = () => {
    if (!loading) return null;
    return <ActivityIndicator style={{ marginTop: 20 }} animating color={"#fff"} size={"large"} />;
  };

  // get Match details
  const getMatch = async () => {
    try {
      setLoading((loading) => true);
      let response = await fetch(`${Constant.API_ENDPOINT}Livescore&matchId=${matchId}&APIkey=${Constant.API_KEY}`, {
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      let json = await response.json();

      if (!json.result) {
        displayMessage(I18n.t('Thematchover'));
        navigation.goBack();
        return;
      }

      Object.values(json.result).forEach(async (m) => {
        //Get match rating and reviews
        Fire.getMatch(m, (matchInfo) => {
          let matchData = m;
          matchData.rating = matchInfo != null ? matchInfo.rating : 0;
          matchData.reviews = matchInfo != null ? matchInfo.reviews : [];
          matchData.usersVoted = matchInfo != null ? matchInfo.usersVoted : [];
          matchData.gifted = matchInfo != null ? matchInfo.gifted || false : false;
          matchData.users = matchInfo != null ? matchInfo.users || [] : [Fire.uid];
          matchData.homeTeam = matchInfo != null ? matchInfo.homeTeam : { uid: `${m.home_team_key}`, score: 0 };
          matchData.awayTeam = matchInfo != null ? matchInfo.awayTeam : { uid: `${m.away_team_key}`, score: 0 };
          matchData[`${m.home_team_key}`] = matchInfo != null ? matchInfo[`${m.home_team_key}`] : 0;
          matchData[`${m.away_team_key}`] = matchInfo != null ? matchInfo[`${m.away_team_key}`] : 0;

          //Update Match Score and users
          if (!matchData.users.includes(Fire.uid)) {
            (async () => {
              await Fire.updateMatch(`${m.event_key}`, {
                users: matchData.users ? [...matchData.users, Fire.uid] : [Fire.uid],
              });
            })();
          }

          if (parseInt(matchData.event_status) * 60 > 5100 && !matchData.gifted) {
            //check if match is over and send balls to winners who voted
            let loser =
              matchData.homeTeam.score > matchData.awayTeam.score ? matchData.awayTeam.uid : matchData.homeTeam.uid;

            let winners = matchData.usersVoted.filter((vote) => vote.team != loser);
            let points = (matchData[`${loser}`] * 0.3) / winners.length || 0;

            winners.forEach(async (winner) => {
              await Fire.updateUser(winner.user, { silverBalls: firebase.firestore.FieldValue.increment(points) });
              await Fire.updateMatch(`${matchData.event_key}`, { gifted: true });
            });
          }

          setMatch(matchData);
        });

        let response_home = await fetch(
          `${Constant.API_ENDPOINT}Teams&teamId=${m.home_team_key}&APIkey=${Constant.API_KEY}`,
          {
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        );

        let home_team = await response_home.json();

        if (home_team.result != undefined) {
          Object.values(home_team.result).forEach(async (team) => {
            setClub(team);
          });
        }

        let response_away = await fetch(
          `${Constant.API_ENDPOINT}Teams&teamId=${m.away_team_key}&APIkey=${Constant.API_KEY}`,
          {
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        );

        let away_team = await response_away.json();

        if (away_team.result != undefined) {
          Object.values(away_team.result).forEach(async (team) => {
            setEnemyClub(team);
          });
        }

        let homeScore = m.event_final_result
          ? m.event_final_result.split("-")[0]
          : m.event_halftime_result.split("-")[0];

        let awayScore = m.event_final_result
          ? m.event_final_result.split("-")[1]
          : m.event_halftime_result.split("-")[1];

        let homeTeam = m.homeTeam;
        let awayTeam = m.awayTeam;

        homeTeam.score = parseInt(homeScore.trim());
        awayTeam.score = parseInt(awayScore.trim());

        await Fire.updateMatch(`${m.event_key}`, {
          homeTeam: homeTeam,
          awayTeam: awayTeam,
        });

        getMatchTimer(m);
      });
      setLoading((loading) => false);
      setRefreshing((refreshing) => false);
    } catch (error) {
      setLoading((loading) => false);
      setRefreshing((refreshing) => false);
      alert(error.message);
    }
  };

  //start timer
  const getMatchTimer = (match) => {
    if (match.event_status != "Finished" && match.event_status != "Half Time") {
      let time = parseInt(match.event_status) * 60;
      setTimer((timer) => time);
      interval.current = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    }
  };

  //get time
  const getTime = () => {
    if (match.event_status == "Finished") {
      return I18n.t('GameOver');
    } else if (match.event_status == "Half Time") {
      return I18n.t('Thefirsthalfover');
    } else {
      return formatMatchTimer(timer);
    }
  };

  const getMatchPlan = () => {
    if (match.event_home_formation == "" || match.event_away_formation == "") {
      return (
        <View style={{ alignItems: "center" }}>
          <Text style={styles.text}> {I18n.t('Thereisnolineupforbothteams')} </Text>
        </View>
      );
    } else {
      var homeForm = match.event_home_formation.split("-");
      var awayForm = match.event_away_formation.split("-");

      let homeTeamFormation = [
        match.lineups.home_team.starting_lineups.slice(0, 1).map((player) => {
          return {
            number: player.player_number,
            name: player.player.length > 10 ? player.player.substr(0, 8) + "..." : player.player,
          };
        }),
      ];

      let awayTeamFormation = [
        match.lineups.away_team.starting_lineups.slice(0, 1).map((player) => {
          return {
            number: player.player_number,
            name: player.player.length > 10 ? player.player.substr(0, 8) + "..." : player.player,
          };
        }),
      ];

      homeForm.forEach((line) => {
        let form = match.lineups.home_team.starting_lineups
          .slice(homeTeamFormation.length, homeTeamFormation.length + parseInt(line))
          .map((player) => {
            return {
              number: player.player_number,
              name: player.player.length > 10 ? player.player.substr(0, 8) + "..." : player.player,
            };
          });

        homeTeamFormation = [...homeTeamFormation, form];
      });

      awayForm.forEach((line) => {
        let form = match.lineups.away_team.starting_lineups
          .slice(awayTeamFormation.length, awayTeamFormation.length + parseInt(line))
          .map((player) => {
            return {
              number: player.player_number,
              name: player.player.length > 10 ? player.player.substr(0, 8) + "..." : player.player,
            };
          });

        awayTeamFormation = [...awayTeamFormation, form];
      });

      var home = {
        name: match.event_home_team,
        module: match.event_home_formation,
        team: homeTeamFormation,
        home_team_events: [],
      };

      var away = {
        name: match.event_away_team,
        module: match.event_away_formation,
        team: awayTeamFormation,
        away_team_events: [],
      };

      return (
        <View style={styles.footballField}>
          <FootballField home={home} away={away} />
        </View>
      );
    }
  };

  //Update Match
  const updateMatch = async () => {
    //Check if user already rated or not
    if (match.reviews != null) {
      if (match.reviews.includes(Fire.uid)) {
        displayMessage(I18n.t('Youhavealreadyrated'));
        setState({ ...state, showDialog: false });
        return;
      }
    }

    //Calculate ratings and reviews
    var ratings = match.reviews != null ? (match.rating + state.rating) / 2 : state.rating;
    var review = match.reviews != null ? [...match.reviews, Fire.uid] : [Fire.uid];

    await Fire.updateMatch(`${match.event_key}`, { rating: ratings, reviews: review });
    displayMessage(I18n.t('Successfullyevaluated'));
  };

  const registerVote = async () => {
    //Check if user has enough balls
    let b = convertArabicNumbers(balls);

    if (parseInt(b) < 5 || parseInt(b) > 500000) {
      alert(I18n.t('Thminimumballsandthemaximumballs'));
      return;
    }

    if (user.silverBalls < parseInt(b)) {
      displayMessage(I18n.t('Youdonhaveenoughballs'));
      setState({ ...state, showBallsDialog: false });
      return;
    }

    //Check if user already voted or not
    if (match.usersVoted) {
      if (match.usersVoted.some((vote) => vote.user == Fire.uid)) {
        displayMessage(I18n.t('Youhavealreadyrated'));
        setState({ ...state, showBallsDialog: false });
        return;
      }
    }

    let usersVoted = match.usersVoted
      ? [...match.usersVoted, { user: Fire.uid, team: state.item.team_key }]
      : [{ user: Fire.uid, team: state.item.team_key }];

    let totalPoints = match[`${state.item.team_key}`] ? match[`${state.item.team_key}`] + parseInt(b) : parseInt(b);

    await Fire.updateMatch(matchId, {
      usersVoted: usersVoted,
      [`${state.item.team_key}`]: totalPoints,
    });

    displayMessage(I18n.t('Successfullynominated'));
    setState({ ...state, showBallsDialog: false });
  };

  const renderDialog = () => {
    return (
      <Dialog
        visible={state.showDialog}
        dialogStyle={{ backgroundColor: "#02aab0", width: width / 1.5 }}
        dialogTitle={<DialogTitle style={{ backgroundColor: "#02aab0" }} align={"center"} title={I18n.t('Review')} />}
        dialogAnimation={new SlideAnimation({ slideFrom: "bottom" })}
        footer={
          <DialogFooter>
            <DialogButton
              align="center"
              text={I18n.t('Submit')}
              onPress={() => {
                setState({ ...state, showDialog: false });
                updateMatch();
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
              defaultRating={match != null ? match.rating : 0}
              onFinishRating={(rating) => setState({ ...state, rating: rating })}
              size={30}
            />
          </View>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={styles.panelButtonTitle}> {I18n.t('AudienceRating')} </Text>
            <StarRating
              ratings={match != null ? match.rating : 0}
              reviews={match != null ? (match.reviews != null ? match.reviews.length : 0) : 0}
            />
          </View>
        </DialogContent>
      </Dialog>
    );
  };

  const renderBallsDialog = () => {
    return (
      <Dialog
        visible={state.showBallsDialog}
        dialogAnimation={new SlideAnimation({ slideFrom: "bottom" })}
        footer={
          <DialogFooter>
            <DialogButton text={I18n.t('Cancel')}onPress={() => setState({ ...state, showBallsDialog: false })} />
            <DialogButton text={I18n.t('confirm')}onPress={registerVote} />
          </DialogFooter>
        }
      >
        <DialogContent style={{ padding: 20 }}>
          {state.item == null ? null : <Text> {state.item.team_name} </Text>}

          <View style={styles.action}>
            <TextInput
              keyboardType="numeric"
              placeholder={I18n.t('numberofsilverballs')}
              placeholderTextColor="grey"
              style={styles.textInput}
              value={balls}
              textContentType="telephoneNumber"
              onChangeText={(text) => setBalls(text)}
            />
            <MaterialCommunityIcons name="soccer" style={{ marginStart: 5 }} color="#000" size={20} />
          </View>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <Animatable.View animation="fadeInUpBig">
        {loading ? (
          renderLoading()
        ) : (
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={styles.team_info}>
              <View style={{ justifyContent: "center", alignItems: "center", marginTop: 15 }}>
                <View style={styles.team_container}>
                  <View style={{ flex: 2, alignItems: "center" }}>
                    <Avatar source={{ uri: club != null ? club.team_logo : "????" }} size={width / 4} />
                    <Text style={styles.text}>{club != null ? club.team_name : "?????"}</Text>
                    <TouchableOpacity
                      onPress={() => setState({ ...state, showBallsDialog: true, item: club })}
                      style={{ alignItems: "center" }}
                    >
                      <Text style={styles.vote}> {I18n.t('loyaltymasses')} </Text>
                      <Text style={styles.vote}>
                        {match != null && club != null
                          ? match[`${club.team_key}`] != null
                            ? match[`${club.team_key}`]
                            : 0
                          : 0}{" "}
                        {I18n.t('balle')}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <ListItem.Title style={styles.title}>{match != null ? getTime() : "00:00"}</ListItem.Title>
                    <Text style={styles.vs_text}>
                      {match != null
                        ? match.event_final_result != null
                          ? match.event_final_result
                          : match.event_halftime_result != null
                          ? match.event_halftime_result
                          : "0-0"
                        : "0-0"}
                    </Text>
                  </View>

                  <View style={{ flex: 2, alignItems: "center" }}>
                    <Avatar source={{ uri: enemyClub != null ? enemyClub.team_logo : "????" }} size={width / 4} />
                    <Text style={styles.text}>{enemyClub != null ? enemyClub.team_name : "?????"}</Text>
                    <TouchableOpacity
                      onPress={() => setState({ ...state, showBallsDialog: true, item: enemyClub })}
                      style={{ alignItems: "center" }}
                    >
                      <Text style={styles.vote}> {I18n.t('loyaltymasses')}  </Text>
                      <Text style={styles.vote}>
                        {match != null && enemyClub != null
                          ? match[`${enemyClub.team_key}`] != null
                            ? match[`${enemyClub.team_key}`]
                            : 0
                          : 0}{" "}
                        {I18n.t('balle')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center"}}>
                  <TouchableOpacity style={styles.rate} onPress={() => setState({ ...state, showDialog: true })}>
                    <Text style={styles.rateText}>{I18n.t('RateMatch')} </Text>
                    <StarRating
                      color="#fff"
                      bottom={true}
                      big={true}
                      ratings={match != null ? match.rating : 0}
                      reviews={match != null ? (match.reviews != null ? match.reviews.length : 0) : 0}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <ListItem.Title style={styles.sub_title}>{I18n.t('Thelineupteams')}</ListItem.Title>
            </View>
            {match != null ? getMatchPlan() : null}
            {renderBallsDialog()}
            {renderDialog()}
          </ScrollView>
        )}
      </Animatable.View>
    </LinearGradient>
  );
};

export default ClubMatchHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  team_info: {
    marginTop: Constants.statusBarHeight,
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 5,
    color: "#fff",
    textAlign: "center",
  },
  sub_title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 15,
    color: "#fff",
  },
  team_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  vs_text: {
    fontSize: width / 17,
    marginTop: 5,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    padding: 10,
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  vote: {
    marginTop: 10,
    fontSize: 15,
    color: "gold",
    fontWeight: "bold",
    textAlign:'center'
  },
  time: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 25,
    color: "#fff",
    fontWeight: "bold",
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -4,
    paddingLeft: 10,
    color: "#000",
  },
  action: {
    width: width / 2,
    flexDirection: "row",
    marginTop: 20,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
  },
  footballField: {
    marginHorizontal: 10,
    padding: 10,
    borderColor: "#fff",
    backgroundColor: "#000",
  },
  rate: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  rateText: {
    fontSize: 19,
    color: "#fff",
    marginBottom: 5,
  },
});
