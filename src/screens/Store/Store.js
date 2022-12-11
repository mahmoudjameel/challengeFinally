import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import BallsStore from "./BallsStore";
import GiftsStore from "./GiftsStore";
import AddStoreItem from "./AddStoreItem";
import EditStoreItem from "./EditStoreItem";
import I18n from '../Translation/I18n';

const Tab = createMaterialTopTabNavigator();
const BallsStoreStackScreenNavigator = createStackNavigator();
const GiftStoreStackScreenNavigator = createStackNavigator();

const Store = ({ navigation }) => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        tabStyle: { vpadding: 20, backgroundColor: "#2b5876",paddingTop:40 },
        showIcon: true,
        activeTintColor: "#08d4c4",
        inactiveTintColor: "#fff",
      }}
      initialRouteName={I18n.t('gifts')}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "futbol";
          if (route.name === I18n.t('gifts')) iconName = "gift";
          return <FontAwesome5 name={iconName} size={20} color={color} />;
        },
      })}
    >
       <Tab.Screen name={I18n.t('gifts')} component={GiftStoreStackScreen} />
      <Tab.Screen name={I18n.t('balls')} component={BallsStoreStackScreen} />
    </Tab.Navigator>
  );
};

export default Store;

const BallsStoreStackScreen = ({ navigation }) => (
  <BallsStoreStackScreenNavigator.Navigator headerMode="none">
    <BallsStoreStackScreenNavigator.Screen name={I18n.t('ballshop')} component={BallsStore} />
    <BallsStoreStackScreenNavigator.Screen name={I18n.t('typepage')} component={EditStoreItem} />
    <BallsStoreStackScreenNavigator.Screen name={I18n.t('addtype')} component={AddStoreItem} />
  </BallsStoreStackScreenNavigator.Navigator>
);

const GiftStoreStackScreen = ({ navigation }) => (
  <GiftStoreStackScreenNavigator.Navigator headerMode="none">
    <GiftStoreStackScreenNavigator.Screen name={I18n.t('Giftshop')} component={GiftsStore} />
  </GiftStoreStackScreenNavigator.Navigator>
);
