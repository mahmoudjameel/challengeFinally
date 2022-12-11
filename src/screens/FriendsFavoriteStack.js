import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FavoriteList from "./FavoriteList";
import FriendsList from "./FriendsList";
import Profile from "./Profile/ProfileScreen";
import Fire from "../Api/Fire";
import EditProfile from "./Profile/EditProfileScreen";
import PrivateChat from "./PrivateChat";
import { STYLES } from "../util/constants";
import I18n from '../screens/Translation/I18n';

const StackScreenNavigator = createStackNavigator();

const FriendsFavoriteStack = ({ navigation }) => (
  <StackScreenNavigator.Navigator initialRouteName={I18n.t('Atachment')} screenOptions={{ headerBackTitleVisible: false }}>
    <StackScreenNavigator.Screen options={{ headerShown: false }} name={I18n.t('Atachment')} component={Profile} />
    <StackScreenNavigator.Screen
      options={STYLES}
      initialParams={{ userId: Fire.uid }}
      name={I18n.t('FavoriteList')}
      component={FavoriteList}
    />
    <StackScreenNavigator.Screen
      options={STYLES}
      initialParams={{ userId: Fire.uid }}
      name={I18n.t('FriendsList')}
      component={FriendsList}
    />
    <StackScreenNavigator.Screen options={STYLES} name={I18n.t('UpdateProfile')} component={EditProfile} />
    <StackScreenNavigator.Screen options={{ headerShown: false }} name={I18n.t('privatechatpage')}  component={PrivateChat} />
  </StackScreenNavigator.Navigator>
);

export default FriendsFavoriteStack;
