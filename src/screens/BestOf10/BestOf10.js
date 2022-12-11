import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import Fire from "../../Api/Fire";
import * as Animatable from "react-native-animatable";
import I18n from '../Translation/I18n';

const BestOf10 = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [end, setEnd] = useState(false);

  //Update All BestOf Collection
  useEffect(() => {
    let isMounted = true;
    let subscriber = null;

    if (isMounted) {
      subscriber = Fire.getAllClubs(async (clubs) => {
        for (const club of clubs) {
          const players = await Fire.getAllPlayers(club.uid);
          for (const player of players) {
            switch (player.type) {
              case "Midfielders": {
                const res = await Fire.getBestOf("BestMiddlePlayer", player.uid);
                if (!res) await Fire.addToBestOf("BestMiddlePlayer", player);
                break;
              }
              case "Forwards": {
                const res = await Fire.getBestOf("BestAttacker", player.uid);
                if (!res) await Fire.addToBestOf("BestAttacker", player);
                break;
              }
              case "Defenders": {
                const res = await Fire.getBestOf("BestDefender", player.uid);
                if (!res) await Fire.addToBestOf("BestDefender", player);
                break;
              }
              case "Goalkeepers": {
                const res = await Fire.getBestOf("BestGoalKeeper", player.uid);
                if (!res) await Fire.addToBestOf("BestGoalKeeper", player);
                break;
              }
            }
          }

          const res = await Fire.getBestOf("BestClub", club.uid);
          const matches = await Fire.getAllMatches(club.uid);

          let goalsOnTeam = 0;
          let goalsForTeam = 0;

          matches.forEach((match) => {
            let homeTeamScore = match.homeTeam.uid == club.uid ? match.homeTeam.score : match.awayTeam.score;
            let awayTeamScore = match.homeTeam.uid != club.uid ? match.homeTeam.score : match.awayTeam.score;
            goalsOnTeam += parseInt(awayTeamScore);
            goalsForTeam += parseInt(homeTeamScore);
          });

          if (res) {
            await Fire.updateBestOf("BestClub", club.uid, { goalsOnTeam: goalsOnTeam, goalsForTeam: goalsForTeam });
          } else {
            let team = club;
            team.goalsOnTeam = goalsOnTeam;
            team.goalsForTeam = goalsForTeam;
            await Fire.addToBestOf("BestClub", team);
          }
        }
      });
      resetBestOf();
      setLoading((prevState) => false);
    }

    return () => {
      subscriber != null ? subscriber.off() : null;
      isMounted = false;
    };
  }, []);

  const resetBestOf = async () => {
    const date = new Date();
    let isLastDay = date.getDate() == new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    if (isLastDay) {
      Fire.resetAllBestOf("BestMiddlePlayer");
      Fire.resetAllBestOf("BestAttacker");
      Fire.resetAllBestOf("BestDefender");
      Fire.resetAllBestOf("BestGoalKeeper");
      Fire.resetAllBestOf("BestClub");
      setEnd(true);
    }
  };

  const renderLoading = () => {
    return (
      <View>
        <ActivityIndicator style={{ marginTop: 20 }} animating color="#fff" size="large" />
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <Animatable.Text animation="bounceIn" style={{ color: "#fff", fontSize: 20, textAlign: "center" }}>
        {I18n.t('Nominationsendamonth')}
      </Animatable.Text>
    );
  };

  const renderItemBestOf = (title) => {
    return (
      <View style={styles.button}>
        <TouchableOpacity
          style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
          onPress={() => navigation.navigate(I18n.t('selectionpage'), { title: title })}
        >
          <LinearGradient
            colors={["#02aab0", "#00cdac"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.linearGradient}
          >
            <Text style={styles.titleText}>{title}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      {loading ? (
        renderLoading()
      ) : end ? (
        renderEmpty()
      ) : (
        <ScrollView>
          <Animatable.View animation="bounceIn">
            <View style={{ width: "100%", alignItems: "center", marginBottom: 20, marginTop: 20 }}>
              <Text style={styles.titleText}>{I18n.t('BestNominations')}</Text>
            </View>
            {renderItemBestOf(I18n.t('beststriker'))}
            {renderItemBestOf(I18n.t('bestmidfielder'))}
            {renderItemBestOf(I18n.t('bestdefender'))}
            {renderItemBestOf(I18n.t('bestgoalkeeper'))}
            {renderItemBestOf(I18n.t('Themostpopularclub'))}
            <View style={styles.title}>
              <Text style={styles.titleText}>{I18n.t('CupNominations')}</Text>
            </View>
            {renderItemBestOf(I18n.t('worldCup'))}
          </Animatable.View>
        </ScrollView>
      )}
    </LinearGradient>
  );
};

export default BestOf10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  action: {
    flexDirection: "row",
    marginTop: 20,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
  },
  button: {
    alignItems: "center",
    marginTop: 25,
  },
  linearGradient: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    width: "100%",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#fff",
    paddingTop: 30,
    marginBottom: 20,
    marginTop: 30,
  },
  titleText: { fontSize: 15, fontWeight: "bold", color: "#fff" },
});
