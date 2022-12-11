import React, { useState, useEffect, useRef, useCallback } from "react";
import { ListItem } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import MatchCard from "../../components/MatchCard";
import * as Animatable from "react-native-animatable";
import * as Constant from "../../util/constants";
import moment from "moment";
import { View, StyleSheet, ActivityIndicator, RefreshControl, Alert, FlatList } from "react-native";
import Fire from "../../Api/Fire";
import { displayMessage } from "../../util/extraMethods";
import I18n from '../Translation/I18n';

const ClubMatchSchedule = ({ route, navigation }) => {
  const { clubId, leagueId } = route.params;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [balls, setBalls] = useState(null);
  const [data, setData] = useState([]);
  const isMounted = useRef(true);

  //Get matches list
  useEffect(() => {
    getMatches();
    getUser();

    // Stop listening for updates
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing((refreshing) => true);
    getMatches();
    getUser();
  }, []);

  const getUser = async () => {
    const user = await Fire.getUser(Fire.uid);
    setUser((u) => user);
    //get balls Points
    const balls = await Fire.getAllBalls(user.subscription);
    setBalls((b) => balls.enterBallChallenge);
  };

  const getMatches = async () => {
    try {
      setLoading((loading) => true);
      let dateFrom = new Date().toISOString().split("T")[0];
      let dateTo = new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split("T")[0];

      let responseFixtures = await fetch(
        `${Constant.API_ENDPOINT}Fixtures&teamId=${clubId}&APIkey=${Constant.API_KEY}&from=${dateFrom}&to=${dateTo}`,
        {
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );
      let jsonFixtures = await responseFixtures.json();

      if (jsonFixtures.result) {
        setData((prevMatches) =>
          jsonFixtures.result
            .filter((match) => {
              return match.event_status != "Finished";
            })
            .sort((a, b) => (a.event_date > b.event_date ? 1 : a.event_date < b.event_date ? -1 : 0))
        );
      }
      setLoading((loading) => false);
      setRefreshing((refreshing) => false);
    } catch (error) {
      setLoading((loading) => false);
      setRefreshing((refreshing) => false);
      alert(error.message);
    }
  };

  //Get timer
  const checkMatch = (match) => {
    let dateNow = moment().local();
    let date = moment(match.event_date + " " + match.event_time).add(1, "hours");
    let diff = moment.duration(dateNow.diff(date)).minutes();

    if (diff <= 120 && diff >= 0) {
      Alert.alert(
        I18n.t('alert'),
        `${I18n.t('Toenterthemdrawn')} ${balls} ${I18n.t('goldens')}`,
        [
          { text: I18n.t('cancel'), style: "cancel" },
          { text: I18n.t('okay'), onPress: () => payForMatch(match) },
        ],
        { cancelable: false }
      );
    } else if (diff > 120) {
      return I18n.t('GameOver');
    } else {
      alert(I18n.t('Thematchhasnyet'));
    }
  };

  const payForMatch = async (match) => {
    if (user != null) {
      if (user.goldBalls >= balls) {
        const res = await Fire.updateUser(Fire.uid, { goldBalls: user.goldBalls - balls });
        if (res) {
          navigation.navigate(I18n.t('Matchhomepage'), { matchId: match.event_key, clubId: clubId });
        }
      } else {
        displayMessage(I18n.t('Youdonhaveballsgold'));
      }
    } else {
      displayMessage(I18n.t('Errors'));
    }
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <Animatable.View animation="bounceIn" style={styles.textContainer}>
        <ListItem.Title style={styles.text}>{I18n.t('Thereisnomatchatthemoment')}</ListItem.Title>
      </Animatable.View>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View style={styles.loading}>
        <ActivityIndicator animating color="#fff" size="large" />
      </View>
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        data={data}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        keyExtractor={(item) => item.event_key}
        renderItem={({ item }) => <MatchCard type={1} match={item} onPress={() => checkMatch(item)} />}
      />
    </LinearGradient>
  );
};

export default ClubMatchSchedule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  loading: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#CED0CE",
  },
  text: {
    color: "#fff",
    fontSize: 30,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
