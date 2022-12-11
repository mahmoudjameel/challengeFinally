import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { ListItem } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import StudioContentCard from "../../../components/StudioContentCard";
import Fire from "../../../Api/Fire";
import I18n from '../../Translation/I18n';

const ClubStudio = ({ route, navigation }) => {
  const { clubId } = route.params;
  const [state, setState] = useState({ loading: true, data: [], user: null });

  //Get Clubs list
  useEffect(() => {
    let isMounted = true;
    const subscriber = Fire.getAllStudioContent(clubId, (content) => {
      if (isMounted) {
        setState((prevState) => {
          return { ...prevState, data: content, loading: false };
        });
      }
    });

    //Get User's information
    if (isMounted) {
      (async () => {
        const user = await Fire.getUser(Fire.uid);
        setState((prevState) => {
          return { ...prevState, user: user };
        });
      })();
    }

    // Stop listening for updates
    return () => {
      if (subscriber) subscriber.off();
      isMounted = false;
    };
  }, []);

  // Go to add studio content
  const goToAddStudioContent = () => {
    if (state.user == null) return;
    if (state.user.subscription == "Bronze") return alert(I18n.t('SorrytheBronzecategorycanaddanything'));
    navigation.navigate(I18n.t('addcontent'));
  };

  const renderFooter = () => {
    if (!state.loading) return null;

    return (
      <View style={styles.loading}>
        <ActivityIndicator animating color="#fff" size="large" />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.button}>
        <TouchableOpacity
          style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
          onPress={goToAddStudioContent}
        >
          <LinearGradient
            colors={["#02aab0", "#00cdac"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.signIn}
          >
            <MaterialCommunityIcons name="plus" color="#fff" size={40} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmpty = () => {
    if (state.loading) return null;
    return (
      <Animatable.View animation="bounceIn" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ListItem.Title style={{ color: "#fff", fontSize: 30 }}>{I18n.t('Thereisnopost')}</ListItem.Title>
      </Animatable.View>
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <Animatable.View style={{ flex: 1 }} animation="bounceIn">
        <FlatList
          data={state.data}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <StudioContentCard
              item={item}
              onPress={() => navigation.navigate(I18n.t('clipinfo'), { itemData: item.uid })}
            />
          )}
        />
      </Animatable.View>
    </LinearGradient>
  );
};

export default ClubStudio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  button: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  signIn: {
    flexDirection: "row",
    width: "16%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    elevation: 5,
  },
  loading: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#CED0CE",
  },
});
