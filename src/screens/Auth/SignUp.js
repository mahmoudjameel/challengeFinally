import React, { useState, useEffect } from "react";
import { RadioButton } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Feather, MaterialIcons } from "@expo/vector-icons";
import ModalSelector from "react-native-modal-selector";
import { educationData , chatData, countries } from "../../util/SelectorData";
import Fire from "../../Api/Fire";
import firebase from "firebase/app";
import Anchor from "../../components/Anchor";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  StyleSheet,
  Alert,
  Animated,
  ActivityIndicator,
} from "react-native";
import { convertArabicNumbers } from "../../util/extraMethods";
import I18n from '../Translation/I18n';

const { height, width } = Dimensions.get("screen");
const height_logo = height * 0.12;

const SignUp = ({ navigation }) => {
  //FadeOutAnimation when pressing next or back
  const [personalFormOpacity] = useState({ opacity: new Animated.Value(1), transX: new Animated.Value(0) });
  const [personalFormOpacityChild] = useState({ opacity: new Animated.Value(1), transX: new Animated.Value(0) });
  const [generalFormOpacity] = useState({ opacity: new Animated.Value(0), transX: new Animated.Value(width) });
  const [TeamFormOpacity] = useState({ opacity: new Animated.Value(0), transX: new Animated.Value(width) });
  const [TeamFormOpacityChild] = useState({ opacity: new Animated.Value(0), transX: new Animated.Value(width) });

  const fadeOutPersonalFormOpacity = () => {
    Animated.timing(personalFormOpacity.opacity, { toValue: 0, duration: 500, useNativeDriver: true }).start();
    Animated.timing(personalFormOpacity.transX, { toValue: -width, duration: 500, useNativeDriver: true }).start();
    Animated.timing(generalFormOpacity.opacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    Animated.timing(generalFormOpacity.transX, { toValue: 0, duration: 500, useNativeDriver: true }).start();
  };

  const fadeBackPersonalFormOpacity = () => {
    Animated.timing(generalFormOpacity.opacity, { toValue: 0, duration: 500, useNativeDriver: true }).start();
    Animated.timing(generalFormOpacity.transX, { toValue: width, duration: 500, useNativeDriver: true }).start();
    Animated.timing(personalFormOpacity.opacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    Animated.timing(personalFormOpacity.transX, { toValue: 0, duration: 500, useNativeDriver: true }).start();
  };

  const fadeOutGeneralFormOpacity = () => {
    Animated.timing(generalFormOpacity.opacity, { toValue: 0, duration: 500, useNativeDriver: true }).start();
    Animated.timing(generalFormOpacity.transX, { toValue: -width, duration: 500, useNativeDriver: true }).start();
    Animated.timing(TeamFormOpacity.opacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    Animated.timing(TeamFormOpacity.transX, { toValue: 0, duration: 500, useNativeDriver: true }).start();
  };

  const fadeBackGeneralFormOpacity = () => {
    Animated.timing(TeamFormOpacity.opacity, { toValue: 0, duration: 500, useNativeDriver: true }).start();
    Animated.timing(TeamFormOpacity.transX, { toValue: width, duration: 500, useNativeDriver: true }).start();
    Animated.timing(generalFormOpacity.opacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    Animated.timing(generalFormOpacity.transX, { toValue: 0, duration: 500, useNativeDriver: true }).start();
  };

  const fadeOutPersonalFormOpacityChild = () => {
    Animated.timing(personalFormOpacityChild.opacity, { toValue: 0, duration: 500, useNativeDriver: true }).start();
    Animated.timing(personalFormOpacityChild.transX, { toValue: -width, duration: 500, useNativeDriver: true }).start();
    Animated.timing(TeamFormOpacityChild.opacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    Animated.timing(TeamFormOpacityChild.transX, { toValue: 0, duration: 500, useNativeDriver: true }).start();
  };

  const fadeBackPersonalFormOpacityChild = () => {
    Animated.timing(TeamFormOpacityChild.opacity, { toValue: 0, duration: 500, useNativeDriver: true }).start();
    Animated.timing(TeamFormOpacityChild.transX, { toValue: width, duration: 500, useNativeDriver: true }).start();
    Animated.timing(personalFormOpacityChild.opacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    Animated.timing(personalFormOpacityChild.transX, { toValue: 0, duration: 500, useNativeDriver: true }).start();
  };

  const friendsData = [
    { key: 1, label:'ذكور فقط'},
    { key: 2, label:'اناث فقط'},
    { key: 3, label:'كليهما'},
  ];
  

  //Change gender
  const [gender, setGender] = useState(I18n.t('Other'));
  //Change User type
  const [checked, setChecked] = useState(I18n.t('Over12yearsold'));
  //Get the data from the form
  const [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    age: "",
    sex: gender,
    nationality: I18n.t('Choosenationality'),
    education: I18n.t('Chooseyourdegree'),
    country: I18n.t('country'),
    city: I18n.t('paymentSelectCity'),
    phoneNumber: 0,
    favLocalTeam: { key: 0, label: I18n.t('Chooseyourlocalteam')},
    FavInterTeam: { key: 0, label: I18n.t('Chooseyourglobalteam') },
    friends: I18n.t('Choosethetypefriendship'),
    chat: I18n.t('stopprivatechat'),
    check_textInputChangeFriends: false,
    check_textInputChangeChat: false,
    check_textInputChangePhoneNumber: false,
    check_textInputChangeCountry: false,
    check_textInputChangeCity: false,
    check_textInputChangeEducation: false,
    check_textInputChangeNationality: false,
    check_textInputChangeName: false,
    check_textInputChangeUserName: false,
    check_textInputChangeEmail: false,
    check_textInputChangeAge: false,
    check_textInputChangeLocalTeam: false,
    check_textInputChangeInterTeam: false,
    secureTextEntry: true,
    isValidPassword: true,
    isValidUser: true,
    loading: false,
    clubs: [],
    cities: [],
    countries: countries,
  });

  //Get Clubs list
  useEffect(() => {
    (async () => {
      const clubs = await Fire.getAllClubsDropList();
      setData({ ...data, clubs: clubs });
    })();
  }, []);

  //Filter cities
  const filterCities = (country) => {
    let filteredData = data.countries.filter((count) => {
      return count.label.toLocaleLowerCase() == country.toLocaleLowerCase();
    });
    return filteredData[0].cities;
  };

  //Check for input validation
  const textInputChange = (type, val) => {
    switch (type) {
      case 1:
        if (val.trim().length >= 10) {
          setData({ ...data, name: val.trim(), check_textInputChangeName: true });
        } else {
          setData({ ...data, name: val.trim(), check_textInputChangeName: false });
        }
        break;
      case 2:
        if (val.trim().length >= 8) {
          setData({ ...data, username: val.trim(), check_textInputChangeUserName: true });
        } else {
          setData({ ...data, username: val.trim(), check_textInputChangeUserName: false });
        }
        break;
      case 3:
        if (val.trim().length >= 8) {
          setData({ ...data, email: val.trim(), check_textInputChangeEmail: true, isValidUser: true });
        } else {
          setData({ ...data, email: val.trim(), check_textInputChangeEmail: false, isValidUser: false });
        }
        break;
      case 4:
        if (val.trim().length >= 1) {
          setData({ ...data, age: val.trim(), check_textInputChangeAge: true });
        } else {
          setData({ ...data, age: val.trim(), check_textInputChangeAge: false });
        }
        break;
      case 5:
        if (val.trim().length >= 1) {
          setData({ ...data, nationality: val.trim(), check_textInputChangeNationality: true });
        } else {
          setData({ ...data, nationality: val.trim(), check_textInputChangeNationality: false });
        }
        break;
      case 6:
        if (val.trim().length >= 1) {
          setData({ ...data, education: val.trim(), check_textInputChangeEducation: true });
        } else {
          setData({ ...data, education: val.trim(), check_textInputChangeEducation: false });
        }
        break;
      case 7:
        if (val.trim().length >= 1) {
          setData({
            ...data,
            country: val.trim(),
            check_textInputChangeCountry: true,
            cities: filterCities(val.trim()),
          });
        } else {
          setData({ ...data, country: val.trim(), check_textInputChangeCountry: false });
        }
        break;
      case 8:
        if (val.trim().length >= 1) {
          setData({ ...data, city: val.trim(), check_textInputChangeCity: true });
        } else {
          setData({ ...data, city: val.trim(), check_textInputChangeCity: false });
        }
        break;
      case 9:
        setData({ ...data, phoneNumber: val, check_textInputChangePhoneNumber: true });
        break;
      case 10:
        if (val.trim().length >= 1) {
          setData({ ...data, friends: val.trim(), check_textInputChangeFriends: true });
        } else {
          setData({ ...data, friends: val.trim(), check_textInputChangeFriends: false });
        }
        break;
      case 11:
        if (val.trim().length >= 1) {
          setData({ ...data, chat: val.trim(), check_textInputChangeChat: true });
        } else {
          setData({ ...data, chat: val.trim(), check_textInputChangeChat: false });
        }
        break;
      case 12:
        if (val) {
          setData({ ...data, favLocalTeam: val, check_textInputChangeLocalTeam: true });
        } else {
          setData({ ...data, favLocalTeam: val, check_textInputChangeLocalTeam: false });
        }
        break;
      case 13:
        if (val) {
          setData({ ...data, FavInterTeam: val, check_textInputChangeInterTeam: true });
        } else {
          setData({ ...data, FavInterTeam: val, check_textInputChangeInterTeam: false });
        }
        break;
    }
  };

  //Handle password change
  const handlePasswordChange = (val) => {
    if (val.trim().length >= 8) {
      setData({ ...data, password: val.trim(), isValidPassword: true });
    } else {
      setData({ ...data, password: val.trim(), isValidPassword: false });
    }
  };

  //Handle password text visibility
  const updateSecureTextEntry = () => {
    setData({ ...data, secureTextEntry: !data.secureTextEntry });
  };

  const handleValidUser = (val) => {
    if (val.trim().length >= 10) {
      setData({ ...data, isValidUser: true });
    } else {
      setData({ ...data, isValidUser: false });
    }
  };

  const renderTermsPolicy = () => {
    return (
      <View style={styles.legalSectionContainer}>
        <Text style={styles.textTerms}>{I18n.t('Creatinganaccountmeanhaouagreeto')}</Text>
        <View style={styles.legalSection}>
          <Anchor href="https://www.challenge2021.com/terms-and-eg">{I18n.t('Privacypolicy')}</Anchor>
          <Text style={styles.textTerms}> • </Text>
          <Anchor href="https://www.challenge2021.com/terms-and-eg">{I18n.t('TermsandConditions')}</Anchor>
        </View>
      </View>
    );
  };

  //On loading
  const renderLoading = () => {
    if (data.loading) {
      return (
        <View style={styles.button}>
          <ActivityIndicator style={{ marginTop: 10 }} animating color={"#fff"} size={"large"} />
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <View style={styles.button}>
            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
              onPress={() =>
                checked == I18n.t('Over12yearsold') ? fadeBackGeneralFormOpacity() : fadeBackPersonalFormOpacityChild()
              }
            >
              <LinearGradient
                colors={["#08d4c4", "#01ab9d"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.signIn}
              >
                <MaterialIcons name="navigate-before" color="#fff" size={20} />
                <Text style={styles.textSign}>{I18n.t('back')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
              onPress={signUp}
            >
              <LinearGradient
                colors={["#08d4c4", "#01ab9d"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.signIn}
              >
                <Text style={styles.textSign}>{I18n.t('Submit')}</Text>
                <MaterialIcons name="navigate-next" color="#fff" size={20} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  //onPress sign up button
  const signUp = async () => {
    if (checked == I18n.t('Over12yearsold')) {
      if (
       // data.check_textInputChangePhoneNumber &&
        //data.check_textInputChangeCountry &&
       // data.check_textInputChangeCity &&
       // data.check_textInputChangeEducation &&
       // data.check_textInputChangeNationality &&
        data.check_textInputChangeName &&
        data.check_textInputChangeUserName &&
        data.check_textInputChangeEmail &&
       // data.check_textInputChangeAge &&
        data.check_textInputChangeLocalTeam &&
        data.check_textInputChangeInterTeam &&
        data.isValidPassword
      ) {
        //Display loading icon
        setData({ ...data, loading: true });

        var user = {
          email: data.email,
          name: data.name,
          username: data.username,
          password: data.password,
          age: convertArabicNumbers(data.age),
          sex: gender,
          type: "Adult",
          image: "https://homepages.cae.wisc.edu/~ece533/images/boat.png",
          nationality: data.nationality,
          education: data.education,
          country: data.country,
          city: data.city,
          phoneNumber: parseInt(convertArabicNumbers(`${data.phoneNumber}`)),
          favLocalTeam: data.favLocalTeam.key,
          FavInterTeam: data.FavInterTeam.key,
          silverBalls: 0,
          goldBalls: 0,
          subscription: "Bronze",
          regGift: true,
          shareGift: false,
          friends: [],
          favorite: [],
          FriendRequests: [],
          PendingFriends: [],
          challenges: [],
          notifications: { [data.favLocalTeam.key]: false, [data.FavInterTeam.key]: false },
          lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
          settings: {
            friends: I18n.t('both'),
            chat: false,
            profile: I18n.t('both'),
            hideName: false,
            hideEmail: false,
            hidePhone: false,
            hideView: false,
            hideAddress: false,
          },
        };

        const response = await Fire.signUpWithEmail(data.email.trim(), data.password.trim(), user);
        setData({ ...data, loading: false });
        //Go to Main Screen
        if (response) navigation.navigate("Login");
      } else {
        setData({ ...data, loading: false });
        Alert.alert(I18n.t('Error'), I18n.t('insertAllFields'), [{ text:  I18n.t('okay')}]);
      }
    } else {
      if (
        data.check_textInputChangeChat &&
        data.check_textInputChangeFriends &&
        data.check_textInputChangePhoneNumber &&
        data.check_textInputChangeUserName &&
        data.isValidPassword &&
        data.check_textInputChangeEmail &&
        data.check_textInputChangeLocalTeam &&
        data.check_textInputChangeInterTeam &&
        data.sex
      ) {
        //Display loading icon
        setData({ ...data, loading: true });

        var user = {
          email: data.email,
          username: data.username,
          password: data.password,
          sex: gender,
          type: "Child",
          favLocalTeam: data.favLocalTeam.key,
          FavInterTeam: data.FavInterTeam.key,
          silverBalls: 0,
          goldBalls: 0,
          image: "https://homepages.cae.wisc.edu/~ece533/images/boat.png",
          subscription: "Bronze",
          regGift: true,
          shareGift: false,
          FriendRequests: [],
          PendingFriends: [],
          favorite: [],
          friends: [],
          challenges: [],
          notifications: { [data.favLocalTeam.key]: false, [data.FavInterTeam.key]: false },
          lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
          settings: {
            friends: data.friends,
            chat: data.chat,
            profile: I18n.t('friendsonly'),
            hideEmail: false,
            hidePhone: false,
            hideView: false,
          },
        };

        const response = await Fire.signUpWithEmail(data.email.trim(), data.password.trim(), user);
        setData({ ...data, loading: false });
        //Go to Main Screen
        if (response) navigation.navigate("Login");
      } else {
        setData({ ...data, loading: false });
        Alert.alert(I18n.t('Error'), I18n.t('insertAllFields'), [{ text: I18n.t('okay')}]);
      }
    }
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <Animatable.View animation="fadeInUpBig">
        <View style={styles.radio}>
          <View style={styles.text}>
            <RadioButton
              value={I18n.t('Over12yearsold')}
              color="#36d1dc"
              status={checked === I18n.t('Over12yearsold') ? "checked" : "unchecked"}
              onPress={() => setChecked(I18n.t('Over12yearsold'))}
            />
            <Text style={{ marginTop: 7, color: "#fff" }}>{I18n.t('Over12yearsold')}</Text>
          </View>
          <View style={styles.text}>
            <RadioButton
              value={I18n.t('under12yearsold')}
              color="#36d1dc"
              status={checked === I18n.t('under12yearsold') ? "checked" : "unchecked"}
              onPress={() => setChecked(I18n.t('under12yearsold'))}
            />
            <Text style={{ marginTop: 7, color: "#fff" }}>{I18n.t('under12yearsold')}</Text>
          </View>
        </View>
        {checked == I18n.t('Over12yearsold') ? (
          <View>
            <Animatable.View
              style={{ opacity: personalFormOpacity.opacity, transform: [{ translateX: personalFormOpacity.transX }] }}
            >
              <View style={styles.action}>
                {data.check_textInputChangeName ? (
                  <Animatable.View animation="bounceIn">
                    <Feather name="check-circle" color="#36d1dc" size={20} />
                  </Animatable.View>
                ) : null}
                <TextInput
                  placeholder={I18n.t('FullName')}
                  placeholderTextColor="#fff"
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => textInputChange(1, val)}
                />
                <FontAwesome name="user-o" style={{ marginStart: 5 }} color="#fff" size={20} />
              </View>
              <View style={styles.action}>
                {data.check_textInputChangeUserName ? (
                  <Animatable.View animation="bounceIn">
                    <Feather name="check-circle" color="#36d1dc" size={20} />
                  </Animatable.View>
                ) : null}
                <TextInput
                  placeholder={I18n.t('UserName')}
                  placeholderTextColor="#fff"
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => textInputChange(2, val)}
                />
                <FontAwesome name="user-o" style={{ marginStart: 5 }} color="#fff" size={20} />
              </View>
              <View style={styles.action}>
                {data.check_textInputChangeEmail ? (
                  <Animatable.View animation="bounceIn">
                    <Feather name="check-circle" color="#36d1dc" size={20} />
                  </Animatable.View>
                ) : null}
                <TextInput
                  placeholder={I18n.t('Email')}
                  placeholderTextColor="#fff"
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => textInputChange(3, val)}
                  onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
                />
                <FontAwesome name="envelope-o" style={{ marginStart: 5 }} color="#fff" size={20} />
              </View>
              <View style={styles.action}>
                <TouchableOpacity onPress={updateSecureTextEntry}>
                  {data.secureTextEntry ? (
                    <Feather name="eye-off" color="#fff" size={20} />
                  ) : (
                    <Feather name="eye" color="#fff" size={20} />
                  )}
                </TouchableOpacity>
                <TextInput
                  placeholder={I18n.t('Password')}
                  placeholderTextColor="#fff"
                  secureTextEntry={data.secureTextEntry ? true : false}
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => handlePasswordChange(val)}
                />
                <Feather name="lock" style={{ marginStart: 5 }} color="#fff" size={20} />
              </View>
              {data.isValidPassword ? null : (
                <Animatable.View animation="fadeInRight" duration={500}>
                  <Text style={styles.errorMsg}>{I18n.t('Passwordmustbemorethan8lettersornumbers')}</Text>
                </Animatable.View>
              )}
              <View style={styles.action}>
                {data.check_textInputChangeAge ? (
                  <Animatable.View animation="bounceIn">
                    <Feather name="check-circle" color="#36d1dc" size={20} />
                  </Animatable.View>
                ) : null}
                <TextInput
                  keyboardType="numeric"
                  placeholder={I18n.t('Age')}
                  placeholderTextColor="#fff"
                  style={styles.textInput}
                  onChangeText={(val) => textInputChange(4, val)}
                />
                <FontAwesome name="calendar-o" style={{ marginStart: 5 }} color="#fff" size={20} />
              </View>
              <View style={styles.radio}>
                <View style={styles.text}>
                  <RadioButton
                    value={I18n.t('female')}
                    color="#36d1dc"
                    status={gender === I18n.t('female') ? "checked" : "unchecked"}
                    onPress={() => setGender(I18n.t('female') )}
                  />
                  <Text style={{ marginTop: 7, color: "#fff" }}>{I18n.t('female')}</Text>
                </View>
                <View style={styles.text}>
                  <RadioButton
                    value={I18n.t('male')}
                    color="#36d1dc"
                    status={gender === I18n.t('male') ? "checked" : "unchecked"}
                    onPress={() => setGender(I18n.t('male'))}
                  />
                  <Text style={{ marginTop: 7, color: "#fff" }}>{I18n.t('male')}</Text>
                </View>
                <View style={styles.text}>
                  <RadioButton
                    value={I18n.t('Other')}
                    color="#36d1dc"
                    status={gender === I18n.t('Other') ? "checked" : "unchecked"}
                    onPress={() => setGender(I18n.t('Other') )}
                  />
                  <Text style={{ marginTop: 7, color: "#fff" }}>{I18n.t('Other')}</Text>
                </View>
              </View>
              <View style={styles.button}>
                <TouchableOpacity
                  style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
                  onPress={() => fadeOutPersonalFormOpacity()}
                >
                  <LinearGradient
                    colors={["#02aab0", "#00cdac"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.signIn}
                  >
                    <MaterialIcons name="navigate-next" color="#fff" size={25} />
                    <Text style={styles.textSign}>{I18n.t('next')}</Text>
                    </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animatable.View>
            <Animatable.View
              style={{
                opacity: generalFormOpacity.opacity,
                transform: [{ translateX: generalFormOpacity.transX }],
                position: "absolute",
              }}
            >
              <View style={[styles.action, { width: "100%" }]}>
                {data.check_textInputChangePhoneNumber ? (
                  <Animatable.View animation="bounceIn">
                    <Feather name="check-circle" color="#36d1dc" size={20} />
                  </Animatable.View>
                ) : null}
                <TextInput
                  keyboardType="numeric"
                  placeholder={I18n.t('Phone')}
                  placeholderTextColor="#fff"
                  style={styles.textInput}
                  textContentType="telephoneNumber"
                  onChangeText={(val) => textInputChange(9, val)}
                  onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
                />
                <FontAwesome name="phone" style={{ marginStart: 5 }} color="#fff" size={20} />
              </View>
              <View style={styles.action}>
                <ModalSelector
                  initValueTextStyle={{ color: "#000" }}
                  style={{ height: 30, width: "100%" }}
                  data={data.countries}
                  initValue={I18n.t('Choosenationality')}
                  onChange={(option) => textInputChange(5, option.label)}
                  cancelText={I18n.t('Cancel')}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {data.check_textInputChangeNationality ? (
                      <Animatable.View animation="bounceIn">
                        <Feather name="check-circle" color="#36d1dc" size={20} />
                      </Animatable.View>
                    ) : null}
                    <Text style={styles.data}>{data.nationality}</Text>
                    <FontAwesome name="caret-down" style={{ padding: 5 }} color="#fff" size={25} />
                  </View>
                </ModalSelector>
              </View>
              <View style={styles.action}>
                <ModalSelector
                  initValueTextStyle={{ color: "#000" }}
                  style={{ height: 30, width: "100%" }}
                  data={educationData}
                  initValue={I18n.t('Chooseyourdegree')}
                  onChange={(option) => textInputChange(6, option.label)}
                  cancelText={I18n.t('cancel')}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {data.check_textInputChangeEducation ? (
                      <Animatable.View animation="bounceIn">
                        <Feather name="check-circle" color="#36d1dc" size={20} />
                      </Animatable.View>
                    ) : null}
                    <Text style={styles.data}>{data.education}</Text>
                    <FontAwesome name="caret-down" style={{ padding: 5 }} color="#fff" size={25} />
                  </View>
                </ModalSelector>
              </View>
              <View style={styles.action}>
                <ModalSelector
                  initValueTextStyle={{ color: "#000" }}
                  style={{ height: 30, width: "100%" }}
                  data={data.countries}
                  initValue={I18n.t('address1')}
                  onChange={(option) => textInputChange(7, option.label)}
                  cancelText={I18n.t('cancel')}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {data.check_textInputChangeCountry ? (
                      <Animatable.View animation="bounceIn">
                        <Feather name="check-circle" color="#36d1dc" size={20} />
                      </Animatable.View>
                    ) : null}
                    <Text style={styles.data}>{data.country}</Text>
                    <FontAwesome name="caret-down" style={{ padding: 5 }} color="#fff" size={25} />
                  </View>
                </ModalSelector>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                <View style={styles.button}>
                  <TouchableOpacity
                    style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
                    onPress={() => fadeBackPersonalFormOpacity()}
                  >
                    <LinearGradient
                      colors={["#08d4c4", "#01ab9d"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.signIn}
                    >
                      <MaterialIcons name="navigate-before" color="#fff" size={20} />
                      <Text style={styles.textSign}>{I18n.t('Back')}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                <View style={styles.button}>
                  <TouchableOpacity
                    style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
                    onPress={() => fadeOutGeneralFormOpacity()}
                  >
                    <LinearGradient
                      colors={["#08d4c4", "#01ab9d"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.signIn}
                    >
                      <Text style={styles.textSign}>{I18n.t('next')}</Text>
                      <MaterialIcons name="navigate-next" color="#fff" size={20} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </Animatable.View>
            <Animatable.View
              style={{
                opacity: TeamFormOpacity.opacity,
                transform: [{ translateX: TeamFormOpacity.transX }],
                position: "absolute",
              }}
            >
              <View style={styles.action}>
                <ModalSelector
                  initValueTextStyle={{ color: "#000" }}
                  style={{ height: 30, width: "100%" }}
                  data={data.cities}
                  initValue={I18n.t('address1')}
                  onChange={(option) => textInputChange(8, option.label)}
                  cancelText={I18n.t('cancel')}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {data.check_textInputChangeCity ? (
                      <Animatable.View animation="bounceIn">
                        <Feather name="check-circle" color="#36d1dc" size={20} />
                      </Animatable.View>
                    ) : null}
                    <Text style={styles.data}>{data.city}</Text>
                    <FontAwesome name="caret-down" style={{ padding: 5 }} color="#fff" size={25} />
                  </View>
                </ModalSelector>
              </View>

              <View style={{ alignItems: "center" }}>
                <Text style={styles.text_sub_header}>{I18n.t('Chooseyourfavoritelocalteam')}</Text>
              </View>
              <View style={styles.action}>
                <ModalSelector
                  initValueTextStyle={{ color: "#000" }}
                  style={{ height: 30, width: "100%" }}
                  data={data.clubs}
                  initValue={I18n.t('Chooseyourteam')}
                  onChange={(option) => textInputChange(12, option)}
                  cancelText={I18n.t('Cancel')}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {data.check_textInputChangeLocalTeam ? (
                      <Animatable.View animation="bounceIn">
                        <Feather name="check-circle" color="#36d1dc" size={20} />
                      </Animatable.View>
                    ) : null}
                    <Text style={styles.data}>{data.favLocalTeam.label}</Text>
                    <FontAwesome name="caret-down" style={{ padding: 5 }} color="#fff" size={25} />
                  </View>
                </ModalSelector>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.text_sub_header}>{I18n.t('Chooseyourfavoriteglobalteam')}</Text>
              </View>
              <View style={styles.action}>
                <ModalSelector
                  initValueTextStyle={{ color: "#000" }}
                  style={{ height: 30, width: "100%" }}
                  data={data.clubs}
                  initValue={I18n.t('Chooseyourteam')}
                  onChange={(option) => textInputChange(13, option)}
                  cancelText={I18n.t('Cancel')}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {data.check_textInputChangeInterTeam ? (
                      <Animatable.View animation="bounceIn">
                        <Feather name="check-circle" color="#36d1dc" size={20} />
                      </Animatable.View>
                    ) : null}
                    <Text style={styles.data}>{data.FavInterTeam.label}</Text>
                    <FontAwesome name="caret-down" style={{ padding: 5 }} color="#fff" size={25} />
                  </View>
                </ModalSelector>
              </View>
              {renderLoading()}
            </Animatable.View>
          </View>
        ) : (
          <View>
            <Animatable.View
              style={{
                opacity: personalFormOpacityChild.opacity,
                transform: [{ translateX: personalFormOpacityChild.transX }],
              }}
            >
              <View style={styles.action}>
                {data.check_textInputChangeUserName ? (
                  <Animatable.View animation="bounceIn">
                    <Feather name="check-circle" color="#36d1dc" size={20} />
                  </Animatable.View>
                ) : null}
                <TextInput
                  placeholder={I18n.t('UserName')}
                  placeholderTextColor="#fff"
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => textInputChange(2, val)}
                  onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
                />
                <FontAwesome name="user-o" style={{ marginStart: 5 }} color="#fff" size={20} />
              </View>
              <View style={styles.action}>
                {data.check_textInputChangeEmail ? (
                  <Animatable.View animation="bounceIn">
                    <Feather name="check-circle" color="#36d1dc" size={20} />
                  </Animatable.View>
                ) : null}
                <TextInput
                  placeholder={I18n.t('Email')}
                  placeholderTextColor="#fff"
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => textInputChange(3, val)}
                  onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
                />
                <FontAwesome name="envelope-o" style={{ marginStart: 5 }} color="#fff" size={20} />
              </View>
              <View style={[styles.action, { width: "100%" }]}>
                {data.check_textInputChangePhoneNumber ? (
                  <Animatable.View animation="bounceIn">
                    <Feather name="check-circle" color="#36d1dc" size={20} />
                  </Animatable.View>
                ) : null}
                <TextInput
                  keyboardType="numeric"
                  placeholder={I18n.t('Phone')}
                  placeholderTextColor="#fff"
                  style={styles.textInput}
                  textContentType="telephoneNumber"
                  onChangeText={(val) => textInputChange(9, val)}
                  onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
                />
                <FontAwesome name="phone" style={{ marginStart: 5 }} color="#fff" size={20} />
              </View>
              <View style={styles.action}>
                <TouchableOpacity onPress={updateSecureTextEntry}>
                  {data.secureTextEntry ? (
                    <Feather name="eye-off" color="#fff" size={20} />
                  ) : (
                    <Feather name="eye" color="#fff" size={20} />
                  )}
                </TouchableOpacity>
                <TextInput
                  placeholder={I18n.t('Password')}
                  placeholderTextColor="#fff"
                  secureTextEntry={data.secureTextEntry ? true : false}
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => handlePasswordChange(val)}
                />
                <Feather name="lock" style={{ marginStart: 5 }} color="#fff" size={20} />
              </View>
              {data.isValidPassword ? null : (
                <Animatable.View animation="fadeInRight" duration={500}>
                  <Text style={styles.errorMsg}>{I18n.t('Passwordmustbemorethan8lettersornumbers')}</Text>
                </Animatable.View>
              )}
              <View style={styles.action}>
                <ModalSelector
                  initValueTextStyle={{ color: "#000" }}
                  style={{ height: 30, width: "100%" }}
                  data={friendsData}
                  initValue={I18n.t('Choosethetypefriendship')}
                  onChange={(option) => textInputChange(10, option.label)}
                  cancelText={I18n.t('cancel')}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {data.check_textInputChangeFriends ? (
                      <Animatable.View animation="bounceIn">
                        <Feather name="check-circle" color="#36d1dc" size={20} />
                      </Animatable.View>
                    ) : null}
                    <Text style={styles.data}>{data.friends}</Text>
                    <FontAwesome name="caret-down" style={{ padding: 5 }} color="#fff" size={25} onPress={() => {}} />
                  </View>
                </ModalSelector>
              </View>
              <View style={styles.radio}>
                <View style={styles.text}>
                  <RadioButton
                    value={I18n.t('female')}
                    color="#36d1dc"
                    status={gender === I18n.t('female') ? "checked" : "unchecked"}
                    onPress={() => setGender(I18n.t('female'))}
                  />
                  <Text style={{ marginTop: 7, color: "#fff" }}>{I18n.t('female')}</Text>
                </View>
                <View style={styles.text}>
                  <RadioButton
                    value={I18n.t('male')}
                    color="#36d1dc"
                    status={gender === I18n.t('male')? "checked" : "unchecked"}
                    onPress={() => setGender(I18n.t('male'))}
                  />
                  <Text style={{ marginTop: 7, color: "#fff" }}>{I18n.t('male')}</Text>
                </View>
              </View>
              <View style={styles.button}>
                <TouchableOpacity
                  style={{ alignItems: "center", flexDirection: "row" }}
                  onPress={() => fadeOutPersonalFormOpacityChild()}
                >
                  <LinearGradient
                    colors={["#08d4c4", "#01ab9d"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.signIn}
                  >
                    <Text style={styles.textSign}>{I18n.t('next')}</Text>
                    <MaterialIcons name="navigate-next" color="#fff" size={20} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animatable.View>
            <Animatable.View
              style={{
                opacity: TeamFormOpacityChild.opacity,
                transform: [{ translateX: TeamFormOpacityChild.transX }],
                position: "absolute",
              }}
            >
              <View style={styles.action}>
                <ModalSelector
                  initValueTextStyle={{ color: "#000" }}
                  style={{ height: 30, width: "100%" }}
                  data={chatData}
                  initValue={I18n.t('stopprivatechat')}
                  onChange={(option) => textInputChange(11, option.label)}
                  cancelText={I18n.t('cancel')}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {data.check_textInputChangeChat ? (
                      <Animatable.View animation="bounceIn">
                        <Feather name="check-circle" color="#36d1dc" size={20} />
                      </Animatable.View>
                    ) : null}
                    <Text style={styles.data}>{data.chat}</Text>
                    <FontAwesome name="caret-down" style={{ padding: 5 }} color="#fff" size={25} onPress={() => {}} />
                  </View>
                </ModalSelector>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.text_sub_header}>{I18n.t('Chooseyourfavoritelocalteam')}</Text>
              </View>
              <View style={styles.action}>
                <ModalSelector
                  initValueTextStyle={{ color: "#000" }}
                  style={{ height: 30, width: "100%" }}
                  data={data.clubs}
                  initValue={I18n.t('Chooseyourteam')}
                  onChange={(option) => textInputChange(12, option)}
                  cancelText={I18n.t('cancel')}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {data.check_textInputChangeLocalTeam ? (
                      <Animatable.View animation="bounceIn">
                        <Feather name="check-circle" color="#36d1dc" size={20} />
                      </Animatable.View>
                    ) : null}
                    <Text style={styles.data}>{data.favLocalTeam.label}</Text>
                    <FontAwesome name="caret-down" style={{ padding: 5 }} color="#fff" size={25} />
                  </View>
                </ModalSelector>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.text_sub_header}>{I18n.t('Chooseyourfavoriteglobalteam')}</Text>
              </View>
              <View style={styles.action}>
                <ModalSelector
                  initValueTextStyle={{ color: "#000" }}
                  style={{ height: 30, width: "100%" }}
                  data={data.clubs}
                  initValue={I18n.t('Chooseyourteam')}
                  onChange={(option) => textInputChange(13, option)}
                  cancelText={I18n.t('cancel')}                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {data.check_textInputChangeInterTeam ? (
                      <Animatable.View animation="bounceIn">
                        <Feather name="check-circle" color="#36d1dc" size={20} />
                      </Animatable.View>
                    ) : null}
                    <Text style={styles.data}>{data.FavInterTeam.label}</Text>
                    <FontAwesome name="caret-down" style={{ padding: 5 }} color="#fff" size={25} />
                  </View>
                </ModalSelector>
              </View>
              {renderLoading()}
            </Animatable.View>
          </View>
        )}
        <View style={styles.button}>
          {renderTermsPolicy()}
          <Text style={{ color: "#fff" }}>
          {I18n.t('BackToLogin')}
            <Text onPress={() => navigation.navigate("Login")} style={{ color: "#36d1dc", fontWeight: "bold" }}>
              {" "}
              {I18n.t('Login')}
            </Text>
          </Text>
        </View>
      </Animatable.View>
    </LinearGradient>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  text_header: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_sub_header: {
    marginTop: 20,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 20,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -4,
    paddingLeft: 10,
    color: "#fff",
  },
  errorMsg: {
    color: "#FF4C4C",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 30,
  },
  signIn: {
    flexDirection: "row",
    width: "60%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    elevation: 5,
  },
  tinyLogo: {
    width: "40%",
    height: height_logo,
  },
  textSign: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
  radio: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  text: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  forgotPass: {
    color: "#009387",
    paddingRight: 10,
    marginTop: 5,
    fontWeight: "bold",
  },
  data: {
    flex: 1,
    padding: 5,
    height: 30,
    color: "#fff",
  },
  dropdown: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "grey",
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 5,
  },
  legalSection: {
    flexDirection: "row",
  },
  legalSectionContainer: {
    marginTop: 10,
    alignSelf: "center",
  },
  textTerms: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
});
