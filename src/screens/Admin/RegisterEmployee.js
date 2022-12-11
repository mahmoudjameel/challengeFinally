import React from "react";
import { View, Text, TouchableOpacity, TextInput, Dimensions, Platform, StyleSheet, StatusBar } from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Feather } from "@expo/vector-icons";
import ModalSelector from "react-native-modal-selector";
import { employeeType } from "../../util/SelectorData";
import I18n from '../Translation/I18n';

const RegisterEmployee = ({ navigation }) => {
  const [data, setData] = React.useState({
    email: "",
    phoneNumber: "",
    username: "",
    employeeType: "اختر نوع الوظيفة",
    password: "",
    check_textInputEmail: false,
    check_textInputPhoneNumber: false,
    check_textInputUsername: false,
    check_textInputEmployeeType: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });

  const textInputChange = (index, val) => {
    switch (index) {
      case 1:
        if (val.trim().length >= 10) {
          setData({
            ...data,
            username: val,
            check_textInputUsername: true,
          });
        } else {
          setData({
            ...data,
            username: val,
            check_textInputUsername: false,
          });
        }
        break;
      case 2:
        if (val.trim().length >= 8) {
          setData({
            ...data,
            email: val,
            check_textInputEmail: true,
          });
        } else {
          setData({
            ...data,
            email: val,
            check_textInputEmail: false,
          });
        }
        break;
      case 3:
        if (val.trim().length >= 8) {
          setData({
            ...data,
            phoneNumber: val,
            check_textInputPhoneNumber: true,
          });
        } else {
          setData({
            ...data,
            phoneNumber: val,
            check_textInputPhoneNumber: false,
          });
        }
        break;
      case 4:
        if (val.trim().length >= 1) {
          setData({
            ...data,
            employeeType: val,
            check_textInputEmployeeType: true,
          });
        } else {
          setData({
            ...data,
            employeeType: val,
            check_textInputEmployeeType: false,
          });
        }
        break;
    }
  };

  const handlePasswordChange = (val) => {
    if (val.trim().length >= 8) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handleValidUser = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };

  // const loginHandle = (userName, password) => {

  //     const foundUser = Users.filter( item => {
  //         return userName == item.username && password == item.password;
  //     } );

  //     if ( data.username.length == 0 || data.password.length == 0 ) {
  //         Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [
  //             {text: 'Okay'}
  //         ]);
  //         return;
  //     }

  //     if ( foundUser.length == 0 ) {
  //         Alert.alert('Invalid User!', 'Username or password is incorrect.', [
  //             {text: 'Okay'}
  //         ]);
  //         return;
  //     }
  //     signIn(foundUser);
  // }

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <View style={styles.action}>
          {data.check_textInputUsername ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="#36d1dc" size={20} />
            </Animatable.View>
          ) : null}
          <TextInput
            placeholder="الاسم الثلاثي"
            placeholderTextColor={"#fff"}
            style={[
              styles.textInput,
              {
                color: "#fff",
              },
            ]}
            autoCapitalize="none"
            onChangeText={(val) => textInputChange(1, val)}
          />
          <FontAwesome name="user-o" style={{ marginStart: 5 }} color={"#fff"} size={20} />
        </View>
        <View style={styles.action}>
          {data.check_textInputEmail ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="#36d1dc" size={20} />
            </Animatable.View>
          ) : null}
          <TextInput
            placeholder="البريد الالكتروني"
            placeholderTextColor={"#fff"}
            style={[
              styles.textInput,
              {
                color: "#fff",
              },
            ]}
            autoCapitalize="none"
            onChangeText={(val) => textInputChange(2, val)}
            onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
          />
          <FontAwesome name="envelope-o" style={{ marginStart: 5 }} color={"#fff"} size={20} />
        </View>
        {data.isValidUser ? null : (
          <Animatable.View animation="fadeInRight" duration={500}>
            <Text style={styles.errorMsg}>{checked} يجب ان تكون كثر من 8 حروف او ارقام</Text>
          </Animatable.View>
        )}
        <View style={styles.action}>
          {data.check_textInputPhoneNumber ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="#36d1dc" size={20} />
            </Animatable.View>
          ) : null}
          <TextInput
            placeholder="رقم الجوال"
            placeholderTextColor={"#fff"}
            style={[
              styles.textInput,
              {
                color: "#fff",
              },
            ]}
            autoCapitalize="none"
            keyboardType="numeric"
            onChangeText={(val) => textInputChange(3, val)}
          />
          <FontAwesome name="phone" style={{ marginStart: 5 }} color={"#fff"} size={20} />
        </View>
        <View style={styles.action}>
          <ModalSelector
            initValueTextStyle={{ color: "#000" }}
            style={{ height: 30, width: "100%" }}
            data={employeeType}
            initValue="اختر نوع الوظيفة"
            onChange={(option) => textInputChange(4, option.label)}
            cancelText={I18n.t('cancel')}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {data.check_textInputChangeNationality ? (
                <Animatable.View animation="bounceIn">
                  <Feather name="check-circle" color="#36d1dc" size={20} />
                </Animatable.View>
              ) : null}
              <Text
                style={{
                  flex: 1,
                  padding: 5,
                  height: 30,
                  color: "#fff",
                }}
              >
                {data.employeeType}
              </Text>
              <FontAwesome name="caret-down" style={{ padding: 5 }} color="#fff" size={25} onPress={() => {}} />
            </View>
          </ModalSelector>
        </View>
        <View style={styles.action}>
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="white" size={20} />
            ) : (
              <Feather name="eye" color="white" size={20} />
            )}
          </TouchableOpacity>
          <TextInput
            placeholder="كلمة السر الخاصة بك"
            placeholderTextColor={"#fff"}
            secureTextEntry={data.secureTextEntry ? true : false}
            style={[
              styles.textInput,
              {
                color: "#fff",
              },
            ]}
            autoCapitalize="none"
            onChangeText={(val) => handlePasswordChange(val)}
          />
          <Feather name="lock" style={{ marginStart: 5 }} color={"#fff"} size={20} />
        </View>
        {data.isValidPassword ? null : (
          <Animatable.View animation="fadeInRight" duration={500}>
            <Text style={styles.errorMsg}>كلمة السر يجب ان تكون كثر من 8 حروف او ارقام</Text>
          </Animatable.View>
        )}
        <View style={styles.button}>
          <TouchableOpacity
            style={{
              marginTop: 50,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
            onPress={() => {
              navigation.navigate("Admin");
            }}
          >
            <LinearGradient
              colors={["#02aab0", "#00cdac"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.signIn}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                تسجيل موظف
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </LinearGradient>
  );
};

export default RegisterEmployee;

const { height, width } = Dimensions.get("screen");
const height_logo = height * 0.25;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flex: 1,
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
  },
  errorMsg: {
    color: "#FF4C4C",
    marginTop: 5,
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 10,
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
});
