import React from "react";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Feather } from "@expo/vector-icons";
import Fire from "../../Api/Fire";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import I18n from '../Translation/I18n';

const Forgot = ({ navigation }) => {
  const [data, setData] = React.useState({
    email: "",
    check_textInputChange: false,
    isValidEmail: true,
    loading: false,
  });

  //Check for input field changes
  const textInputChange = (val) => {
    if (val.trim().length >= 8) {
      setData({ ...data, email: val, check_textInputChange: true, isValidEmail: true });
    } else {
      setData({ ...data, email: val, check_textInputChange: false, isValidEmail: false });
    }
  };

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
        <View style={styles.button}>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
            onPress={resetPass}
          >
            <LinearGradient
              colors={["#02aab0", "#00cdac"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.signIn}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>{I18n.t('Sendtoemail')}</Text>
              
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    }
  };

  //onPress reset button
  const resetPass = async () => {
    //Display loading icon
    setData((prevState) => {
      return { ...prevState, loading: true };
    });


    await Fire.resetPassword(data.email);

    setData((prevState) => {
      return { ...prevState, loading: false };
    });
  };

  return (
    <LinearGradient LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <Animatable.View animation="fadeIn" duraton="1500" style={styles.header}>
        <Image style={styles.tinyLogo} source={require("../../../assets/cheering.png")} />
        <View style={{ width: "100%", alignItems: "center", marginTop: 50 }}>
          <Text style={{ color: "#fff", fontSize: 25, fontWeight: "bold" }}>{I18n.t('changePassword')}</Text>
        </View>
      </Animatable.View>
      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <View style={styles.action}>
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="#36d1dc" size={20} />
            </Animatable.View>
          ) : null}
          <TextInput
            placeholder={I18n.t('Email')}
            placeholderTextColor={"#fff"}
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => textInputChange(val)}
            value={data.email}
          />
          <FontAwesome name={"envelope-o"} style={{ marginStart: 5 }} color="#fff" size={20} />
        </View>
          <Animatable.View animation="fadeInRight" duration={500}>
            <Text style={styles.errorMsg}>{I18n.t('Emailmustbemorethan8umbers')}</Text>
          </Animatable.View>
    
        {renderLoading()}
      </Animatable.View>
    </LinearGradient>
  );
};

export default Forgot;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.17;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#01ab9d",
  },
  header: {
    flex: 2.5,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footer: {
    flex: 3,
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  text_header: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 30,
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
    paddingLeft: 10,
    color: "#fff",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
    textAlign:'center'
  },
  button: {
    alignItems: "center",
    marginTop: 40,
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
    color: "#009387",
    paddingRight: 10,
    marginTop: 5,
    fontWeight: "bold",
  },
});
