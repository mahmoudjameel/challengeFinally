import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import ModalSelector from "react-native-modal-selector";
import { ScrollView } from "react-native-gesture-handler";
import Fire from "../Api/Fire";
import { displayMessage } from "../util/extraMethods";
import I18n from '../screens/Translation/I18n';

const Support = () => {
  const [state, setState] = useState({ type: I18n.t('Choosethetypeofproblem'), message: "", loading: false, user: {} });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const user = await Fire.getUser(Fire.uid);
      if (isMounted) setState({ ...state, user: user });
    })();
    return () => (isMounted = false);
  }, []);

  //Handle Submition
  const sendTicket = async () => {
    //Display Loading icon
    setState((prevState) => {
      return { ...prevState, loading: true };
    });

    if (state.message.trim().length == 0) {
      //Hide Loading icon
      setState((prevState) => {
        return { ...prevState, message: "", loading: false };
      });

      displayMessage(I18n.t('Pleasewriteyourproblem'));
      return;
    }

    await Fire.addTicket({
      userId: state.user.uid,
      userImage: state.user.image,
      userName: state.user.name,
      userEmail: state.user.email,
      type: state.type == I18n.t('Choosethetypeofproblem') ? typeData[0].label : state.type,
      message: state.message,
      solved: false,
      createdAt: new Date(),
    });

    //Hide Loading icon
    setState((prevState) => {
      return { ...prevState, message: "", loading: false };
    });
  };

  const typeData = [
    { key: 1, label: I18n.t('Technicalproblem')},
    { key: 2, label: I18n.t('Inquireabouttheinformation')},
    { key: 2, label: I18n.t('Reportannoyingpeople')},
    { key: 2, label: I18n.t('Reportoffensivecontent')},
    { key: 2, label: I18n.t('Requestaccount')},
  ];
  
  
  //On loading
  const renderLoading = () => {
    if (state.loading) {
      return (
        <View style={styles.button}>
          <ActivityIndicator style={{ marginTop: 10 }} animating color={"#fff"} size={"large"} />
        </View>
      );
    } else {
      return (
        <TouchableOpacity style={styles.button} onPress={sendTicket}>
          <LinearGradient
            colors={["#02aab0", "#00cdac"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.signIn}
          >
            <Text style={styles.buttonText}>{I18n.t('Sendtotechnicalsupport')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <ScrollView>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={[styles.text, { color: "#fff", textAlign:"center" }]}>{I18n.t('Wearegladtoserveyouassoonaspossible')}</Text>
        </View>
        <View style={{ flex: 3 }}>
          <View style={styles.action}>
            <ModalSelector
              initValueTextStyle={{ color: "#fff" }}
              style={{ height: 30, width: "100%" }}
              data={typeData}
              initValue={I18n.t('Choosethetypeofproblem')}
              onChange={(option) => setState({ ...state, type: option.label })}
              cancelText={I18n.t('Cancel')}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.type}>{state.type}</Text>
                <FontAwesome name="caret-down" style={{ padding: 5 }} color="#fff" size={25} />
              </View>
            </ModalSelector>
          </View>
          <View style={styles.action}>
            <TextInput
              placeholder={I18n.t('Writeyourmessagehere')}
              placeholderTextColor="silver"
              autoCorrect={false}
              multiline={true}
              numberOfLines={10}
              style={styles.textInput}
              value={state.message}
              onChangeText={(value) => setState({ ...state, message: value })}
            />
          </View>
          {renderLoading()}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Support;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
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
    color: "#fff",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 40,
  },
  signIn: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  type: { flex: 1, padding: 5, height: 30, color: "#fff" },
});
