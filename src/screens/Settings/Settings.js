import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Drawer, Text, TouchableRipple, Switch } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import ModalSelector from "react-native-modal-selector";
import Fire from "../../Api/Fire";
import { TouchableOpacity } from "react-native-gesture-handler";
import { displayMessage } from "../../util/extraMethods";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import I18n from '../Translation/I18n';

const Settings = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  const profileData = [
    { key: 1, label: I18n.t('All')},
    { key: 2, label: I18n.t('friendsonly')},
  ];
  

const friendsData = [
  { key: 1, label:'ذكور فقط'},
  { key: 2, label:'اناث فقط'},
  { key: 3, label:'كليهما'},
];


  const [state, setState] = useState({
    friends: friendsData[0].label,
    chat: false,
    profile: profileData[0].label,
    hideName: false,
    hideEmail: false,
    hidePhone: false,
    hideView: false,
    hideAddress: false,
  });
  const mounted = useRef(true);

  useEffect(() => {
    if (mounted.current) getUser();
    return () => (mounted.current = false);
  }, []);

  //Get User Settings
  const getUser = async () => {
    const user = await Fire.getUser(Fire.uid);
    setState(user.settings);
    setUser(user);
  };

  //Update user settings
  const updateSettings = async () => {
    if (mounted.current) {
      //Display loading icon
      setLoading((prevState) => true);

      const response = await Fire.updateUser(Fire.uid, { settings: state });
      if (response) displayMessage(I18n.t('Settingsbeenupdated'));
      getUser();

      //hide loading icon
      setLoading((prevState) => false);
    }
  };

  //On loading
  const renderLoading = () => {
    if (loading) {
      return (
        <View>
          <ActivityIndicator style={{ marginTop: 20 }} animating color={"#fff"} size={"large"} />
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
          rippleColor="#86E0FF"
          onPress={updateSettings}
        >
          <LinearGradient
            colors={["#02aab0", "#00cdac"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={{ color: "white" }}>{I18n.t('Submit')}</Text>
          </LinearGradient>
        </TouchableOpacity>
        
      );
      
    }
  };
  const renderLanguge = () => {
    if (loading) {
      return (
        <View>
        </View>
      );
    } else {
      
      return (
        <TouchableOpacity
          style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
          rippleColor="#86E0FF"
          onPress={() => navigation.navigate('lang')}
        >
          <LinearGradient
            colors={["#02aab0", "#00cdac"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={{ color: "red" }}>{I18n.t('changeLanguage')}</Text>
          </LinearGradient>
        </TouchableOpacity>
        
      );
      
    }
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <DrawerContentScrollView>
        {user.type == "Adult" ? (
          <Drawer.Section>
            <TouchableRipple
              style={styles.hello1}
              rippleColor="#86E0FF"
              onPress={() =>
                setState((prevState) => {
                  return { ...prevState, chat: !state.chat };
                })
              }
            >
              <View style={styles.preference}>
                <Text style={styles.bold}>{I18n.t('stopprivatechat')}</Text>
                <View pointerEvents="none">
                  <Switch value={state.chat} />
                </View>
              </View>
            </TouchableRipple>

            <TouchableRipple style={styles.hello1} rippleColor="#86E0FF">
              <ModalSelector
                initValueTextStyle={{ color: "#fff" }}
                style={{ height: 40, width: "100%" }}
                data={friendsData}
                initValue={friendsData[0].label}
                onChange={(option) =>
                  setState((prevState) => {
                    return { ...prevState, friends: option.label };
                  })
                }
                cancelText={I18n.t('Cancel')}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, padding: 5, height: 40 }}>
                    <Text style={styles.bold}>{I18n.t('Choosethetypefriendship')}</Text>
                    <Text style={{ color: "gold" }}>{state.friends}</Text>
                  </View>
                  <FontAwesome name="caret-down" style={{ padding: 5, paddingRight: 20 }} color="#fff" size={25} />
                </View>
              </ModalSelector>
            </TouchableRipple>
            <TouchableRipple style={styles.hello1} rippleColor="#86E0FF" onPress={() => {}}>
              <ModalSelector
                initValueTextStyle={{ color: "#fff" }}
                style={{ height: 40, width: "100%" }}
                data={profileData}
                initValue={profileData[0].label}
                onChange={(option) =>
                  setState((prevState) => {
                    return { ...prevState, profile: option.label };
                  })
                }
                cancelText={I18n.t('Cancel')}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, padding: 5, height: 40 }}>
                    <Text style={styles.bold}>{I18n.t('Selectwhocanseeyouraccount')}</Text>
                    <Text style={{ color: "gold" }}>{state.profile}</Text>
                  </View>
                  <FontAwesome name="caret-down" style={{ padding: 5, paddingRight: 20 }} color="#fff" size={25} />
                </View>
              </ModalSelector>
            </TouchableRipple>
          </Drawer.Section>
        ) : null}
        <Drawer.Section>
          {user.type == "Adult" ? (
            <>
              <TouchableRipple
                style={styles.hello1}
                rippleColor="#86E0FF"
                onPress={() =>
                  setState((prevState) => {
                    return { ...prevState, hideName: !state.hideName };
                  })
                }
              >
                <View style={styles.preference}>
                  <Text style={styles.bold}>{I18n.t('hidetriplename')}</Text>
                  <View pointerEvents="none">
                    <Switch value={state.hideName} />
                  </View>
                </View>
              </TouchableRipple>
              <TouchableRipple
                style={styles.hello1}
                rippleColor="#86E0FF"
                onPress={() =>
                  setState((prevState) => {
                    return { ...prevState, hideAddress: !state.hideAddress };
                  })
                }
              >
                <View style={styles.preference}>
                  <Text style={styles.bold}>{I18n.t('hideaddress')}</Text>
                  <View pointerEvents="none">
                    <Switch value={state.hideAddress} />
                  </View>
                </View>
              </TouchableRipple>
            </>
          ) : null}
          <TouchableRipple
            style={styles.hello1}
            rippleColor="#86E0FF"
            onPress={() =>
              setState((prevState) => {
                return { ...prevState, hidePhone: !state.hidePhone };
              })
            }
          >
            <View style={styles.preference}>
              <Text style={styles.bold}>{I18n.t('hidemobilenumber')}</Text>
              <View pointerEvents="none">
                <Switch value={state.hidePhone} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple
            style={styles.hello1}
            rippleColor="#86E0FF"
            onPress={() =>
              setState((prevState) => {
                return { ...prevState, hideView: !state.hideView };
              })
            }
          >
            <View style={styles.preference}>
              <Text style={styles.bold}>{I18n.t('Hideyourbio')}</Text>
              <View pointerEvents="none">
                <Switch value={state.hideView} />
              </View>
            </View>
          </TouchableRipple>

          <TouchableRipple
            style={styles.hello1}
            rippleColor="#86E0FF"
            onPress={() =>
              setState((prevState) => {
                return { ...prevState, hideEmail: !state.hideEmail };
              })
            }
          >
            <View style={styles.preference}>
              <Text style={styles.bold}>{I18n.t('hideemail')}</Text>
              <View pointerEvents="none">
                <Switch value={state.hideEmail} />
              </View>
            </View>
          </TouchableRipple>
      
        
        </Drawer.Section>
        <View style={{marginBottom:5}}>
        {renderLanguge()}
        </View>
       

        {renderLoading()}

       
      </DrawerContentScrollView>
    </LinearGradient>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  hello1: {
    padding: 15,
  },
  text_action: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    margin: 15,
    padding: 15,
  },
  textInput: {
    height: 50,
    flex: 1,
    color: "#05375a",
  },
  bold: {
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    padding: 15,
  },
});
