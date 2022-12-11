import React, { useState, useContext } from 'react';
import { RadioButton } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Feather } from "@expo/vector-icons";
import Fire from "../../Api/Fire";
import { convertArabicNumbers } from "../../util/extraMethods";
import firebase from "firebase/app";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import I18n from '../Translation/I18n';
import { MaterialIcons } from "@expo/vector-icons";
const Login = ({ navigation }) => {
const [checked, setChecked] = React.useState(I18n.t('Email'));
const [data, setData] = React.useState({
    username: "",
    password: "",
    name: "",
    image: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
    loading: false,
  });
  //Check for input field changes
  const textInputChange = (val) => {
    if (val.trim().length >= 8) {
      setData({ ...data, username: val, check_textInputChange: true, isValidUser: true });
    } else {
      setData({ ...data, username: val, check_textInputChange: false, isValidUser: false });
    }
  };

  const handlePasswordChange = (val) => {
    if (val.trim().length >= 8) {
      setData({ ...data, password: val, isValidPassword: true });
    } else {
      setData({ ...data, password: val, isValidPassword: false });
    }
  };

  const updateSecureTextEntry = () => {
    setData({ ...data, secureTextEntry: !data.secureTextEntry });
  };

  const handleValidUser = (val) => {
    if (val.trim().length >= 4) {
      setData({ ...data, isValidUser: true });
    } else {
      setData({ ...data, isValidUser: false });
    }
  };

  //onPress sign up button
  const login = async () => {
    if (data.isValidUser && data.isValidPassword) {
      //Display Loading
      setData({ ...data, loading: true });
      if (checked == I18n.t('Email')) {
        //Firebase Sign up method
        await Fire.signInWithEmail(data.username.trim(), data.password, navigation);
        setData({ ...data, loading: false });
      } else {
        await Fire.signInWithPhone(convertArabicNumbers(data.username.trim()), data.password, navigation);
        setData({ ...data, loading: false });
      }
    } else {
      Alert.alert(I18n.t('Error'), I18n.t('insertAllFields'), [{ text: I18n.t('okay') }]);    }
  };

  
  
  // const Glogin = async () => {
  //   try {
  //     //  await GoogleSignIn.askForPlayServicesAsync();
  //     const result = await Google.logInAsync({
  //       //return an object with result token and user
  //       iosClientId: `1017832191003-3mm6u8rc3ff8ck2di60a3rtcj247uche.apps.googleusercontent.com`,
  //       androidClientId: `1017832191003-78a0av1mkb988cpbjuj3bcp07uecskvr.apps.googleusercontent.com`,
  //       webClientId: `1017832191003-2ev9rd9s4k7id6ppv7bgvt9ncl3lm7ct.apps.googleusercontent.com`,
  //       scopes: ["profile", "email"],
  //     });

  //     if (result.type === "success") {
  //       console.log(result);
  //       const credential = firebase.auth.GoogleAuthProvider.credential(
  //         //Set the tokens to Firebase
  //         result.idToken,
  //         result.accessToken
  //       );

  //       firebase
  //         .auth()
  //         .signInWithCredential(credential) //Login to Firebase
  //         .then((userCreds) => {
  //           const user = {uid: userCreds.user.uid};// add the information u want to save to the database for example: name, email...etc
  //           Fire.users.db
  //           .doc(userCreds.user.uid)
  //             .set(user)
  //             .then((result) => {
  //               //user is saved successfully
  //             })
  //             .catch((error) => {
  //               //error saving the user
  //               console.log(error);
  //             });
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //       navigation.navigate("DrawerContent");
  //     } else {
  //       //CANCEL
  //     }
  //   } catch ({ message }) {
  //     alert("login: Error:" + message);
  //   }
  // };


  //On loading
  const renderLoading = () => {
    if (data.loading) {
      return (
        <View style={styles.button}>
          <ActivityIndicator style={{ marginTop: 10 }} animating color="#fff" size="large" />
        </View>
      );
    } else {
      return (
        <View>
          <TouchableOpacity style={styles.button} onPress={login}>
            <LinearGradient
              colors={["#02aab0", "#00cdac"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.signIn}
            >
              <Text style={styles.signInText}>{I18n.t('Login')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.tinyLogo} source={require("../../../assets/cheering.png")} />
      </View>
      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <View style={styles.radio}>
          <View style={styles.text}>
            <RadioButton
              value= {I18n.t('Email')}
              color="#36d1dc"
              status={checked === I18n.t('Email') ? "checked" : "unchecked"}
              onPress={() => setChecked(I18n.t('Email'))}
            />
            <Text style={{ marginTop: 7, color: "#fff" }}>{I18n.t('Email')}</Text>
          </View>
          <View style={styles.text}>
            <RadioButton
              value={I18n.t('Phone')}
              color="#36d1dc"
              status={checked === I18n.t('Phone') ? "checked" : "unchecked"}
              onPress={() => setChecked(I18n.t('Phone'))}
            />
            <Text style={{ marginTop: 7, color: "#fff" }}>{I18n.t('Phoner')}</Text>
          </View>
        </View>
        <View style={styles.action}>
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="#36d1dc" size={20} />
            </Animatable.View>
          ) : null}
          <TextInput
            placeholder={checked}
            placeholderTextColor={"#fff"}
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => textInputChange(val)}
            onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
          />
          <FontAwesome
            name={checked == I18n.t('Phone') ? "phone" : "envelope-o"}
            style={{ marginStart: 5 }}
            color="#fff"
            size={20}
          />
        </View>
        {data.isValidUser ? null : (
          <Animatable.View animation="fadeInRight" duration={500}>
            <Text style={styles.errorMsg}>{checked} {I18n.t('Itmustbemorethan8lettersornumbers')}</Text>
          </Animatable.View>
        )}
        <View style={styles.action}>
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="white" size={20} />
            ) : (
              <Feather name="eye" color="white" size={20} />
            )}
          </TouchableOpacity>
          <TextInput
            placeholder={I18n.t('Password')}
            placeholderTextColor={"#fff"}
            secureTextEntry={data.secureTextEntry ? true : false}
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => handlePasswordChange(val)}
          />
          <Feather name="lock" style={{ marginStart: 5 }} color={"#fff"} size={20} />
        </View>
        {data.isValidPassword ? null : (
          <Animatable.View animation="fadeInRight" duration={500}>
            <Text style={styles.errorMsg}>{I18n.t('Passwordmustbemorethan8lettersornumbers')}</Text>
          </Animatable.View>
        )}
        <TouchableOpacity onPress={() => navigation.navigate("Forgot")}>
          <Text style={styles.forgotPass}> {I18n.t('ForgotPassword')}</Text>
        </TouchableOpacity>
        {renderLoading()}
        <Text style={{ color: "#fff", marginTop: 25, alignSelf: "center" }}>
        {I18n.t('HavenotAccount')}
          <Text onPress={() => navigation.navigate("SignUp")} style={{ color: "#36d1dc", fontWeight: "bold" }}>
          {I18n.t('registerNow')}
          </Text>
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('lang')}>
        <Text style={{ color: "#fff", marginTop: 25, alignSelf: "center" }}>
        {I18n.t('changehelanguage')}
        <MaterialIcons name="language" size={25} color="white" />
        </Text>
        </TouchableOpacity>
      
        
      
      </Animatable.View>
    </LinearGradient>
  );
};

export default Login;

const { height, width } = Dimensions.get("screen");
const height_logo = height * 0.25;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footer: {
    flex: 3.5,
    paddingVertical: 30,
    paddingHorizontal: 30,
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
    marginTop: 15,
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
    marginTop: 5,
    fontSize: 14,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  signIn: {
    flexDirection: "row",
    width: "70%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    elevation: 5,
  },
  signInG:{
    flexDirection: "row",
    width: "70%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    elevation: 5,

  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  radio: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  text: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  tinyLogo: {
    width: "50%",
    height: height_logo,
  },
  forgotPass: {
    color: "#36d1dc",
    paddingRight: 20,
    marginTop: 10,
    fontWeight: "bold",
  },
  signInText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
