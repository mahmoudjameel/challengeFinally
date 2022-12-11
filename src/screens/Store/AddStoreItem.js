import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Fire from "../../Api/Fire";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { convertArabicNumbers } from "../../util/extraMethods";
import I18n from '../Translation/I18n';

const AddStoreItem = ({ route, navigation }) => {
  const [state, setstate] = useState({
    loading: false,
    image: "",
    amount: "",
    price: "",
    user: null,
    balls: 10000,
    silverBalls: 0,
  });

  //Get the permission
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }

      //Get User Info
      const user = await Fire.getUser(Fire.uid);
      const ballsPoints = await Fire.getAllBalls(user.subscription);
      setstate({
        ...state,
        user: { uid: user.uid, username: user.username, image: user.image, email: user.email, IBAN: user.IBAN , phoneNumber: user.phoneNumber ,  city: user.city|| "" },
        balls: parseInt(ballsPoints.minBallsToSell || 10000),
        silverBalls: user.silverBalls,
      });
    })();
  }, []);

  //uploadContent
  const addItem = async () => {
    if (state.price.trim() == 0 || state.amount.trim() == 0) return alert(I18n.t('Allfieldsmustbefilledout'));

    setstate((prevState) => {
      return { ...prevState, loading: true };
    });

    let amount = parseInt(convertArabicNumbers(state.amount));
    let price = parseInt(convertArabicNumbers(state.price));

    if (amount < state.balls) {
      alert(`${I18n.t('Minimumquantityforsaleis')} ${state.balls}`);
      setstate((prevState) => {
        return { ...prevState, loading: false };
      });
      return;
    }

    if (state.silverBalls < amount) {
      alert(I18n.t('Youcanmorethanyouballs'));
      setstate((prevState) => {
        return { ...prevState, loading: false };
      });
      return;
    }

    const response = await Fire.addToStore("BallsStore", { user: state.user, amount: amount, price: price });

    setstate((prevState) => {
      return { ...prevState, loading: false };
    });
    response ? navigation.goBack() : null;
  };
///alert
 const showAlert = () => {
  Alert.alert(
    I18n.t('alert'),
    `${I18n.t('willbededucted')}${createChallenge}${I18n.t('Silverballsaccount')}`,
    [
      { text: I18n.t('cancel'), style: "cancel" },
      { text: I18n.t('okay'), onPress: submitChallenge },
    ],
    { cancelable: false }
  );
};

  //On loading
  const renderLoading = () => {
    if (state.loading) {
      return (
        <View>
          <ActivityIndicator style={{ marginTop: 10 }} animating color="#fff" size="large" />
        </View>
      );
    } else {
      return (
        <TouchableOpacity style={styles.commandButton} onPress={addItem}>
          <LinearGradient
            colors={["#02aab0", "#00cdac"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.linearGradient}
          >
            <Text style={{ fontWeight: "bold", color: "white" }}>{I18n.t('Submit')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Icon name="soccer" size={100} color="white" />
      </View>
      <View style={styles.action}>
        <TextInput
          placeholder={I18n.t('Quantity')}
          placeholderTextColor="silver"
          autoCorrect={false}
          style={styles.textInput}
          keyboardType="numeric"
          onChangeText={(text) => setstate({ ...state, amount: text })}
          value={state.amount}
        />
      </View>
      <View style={styles.action}>
        <TextInput
          placeholder={I18n.t('price')}
          placeholderTextColor="silver"
          autoCorrect={false}
          style={styles.textInput}
          keyboardType="numeric"
          onChangeText={(text) => setstate({ ...state, price: text })}
          value={state.price}
        />
      </View>
      {renderLoading()}
      <View style={{alignItems:'center', paddingTop:50}}>

      <Text style={{textAlign:'center', color:'red', margin:5, fontWeight:'600'}}> {I18n.t('Warning')} </Text>
      </View>
    </LinearGradient>
  );
};

export default AddStoreItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  commandButton: {
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: "#4e4376",
    paddingTop: 20,
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
  linearGradient: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    padding: 15,
    borderRadius: 10,
  },
});
