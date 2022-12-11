import React from "react";
import { MaterialCommunityIcons as Icon, Ionicons as Icons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { DrawerActions } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./Home";
import UserChallengeList from "./UserChallengesList";
import Settings from "./Settings/Settings";
import ItemsList from "./ItemsList";
import PrivateChatList from "./PrivateChatList";
import Store from "./Store/Store";
import Support from "./Support";
import Subscription from "./Subscription";
import { DrawerContent } from "./DrawerContent";
import TalentChallengeViewer from "./TalentChallenge/TalentChallengeViewer";
import { STYLES } from "../util/constants";
import I18n from '../screens/Translation/I18n';
import WheelOfFortune from "./WheelOfFortune/WheelOfFortune";

const DrawerNavigator = createDrawerNavigator();
const WheelOfFortuneStackScreenNavigator = createStackNavigator();
const UserChallengeListStackScreenNavigator = createStackNavigator();
const SettingsStackScreenNavigator = createStackNavigator();
const PrivateChatStackScreenNavigator = createStackNavigator();
const SubscriptionStackScreenNavigator = createStackNavigator();
const SupportStackScreenNavigator = createStackNavigator();
const StoreStackScreenNavigator = createStackNavigator();
const ItemsStackScreenNavigator = createStackNavigator();

const styles = (navigation) => {
  return {
    ...STYLES,
    headerLeft: () => (
      <Icons.Button
        name="ios-menu"
        size={30}
        color="#fff"
        backgroundColor="transparent"
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
    ),
  };
};

const MainScreen = () => {
  return (
    <DrawerNavigator.Navigator
      drawerStyle={{ backgroundColor: "transparent" }}
      drawerContent={(props) => <DrawerContent {...props} />}
      initialRouteName={I18n.t('Home')}
      drawerContentOptions={{
        labelStyle: { color: "#fff" },
        activeBackgroundColor: "#5cbbff",
        activeTintColor: "#ffffff",
      }}
    >
      <DrawerNavigator.Screen
        name={I18n.t('Home')}
        component={Home}
        options={{ drawerIcon: (config) => <Icon name="home" color="#fff" size={24} /> }}
      />
      <DrawerNavigator.Screen
        name={I18n.t('Postlog')}
        component={UserChallengeListStackScreen}
        options={{ drawerIcon: (config) => <Icon name="format-list-bulleted" color="#fff" size={24} /> }}
      />
      <DrawerNavigator.Screen
        name={I18n.t('Properties')}
        component={ItemsStackScreen}
        options={{ drawerIcon: (config) => <Icon name="gift" color="#fff" size={24} /> }}
      />
      <DrawerNavigator.Screen
        name={I18n.t('privatechat')}
        component={PrivateChatStackScreen}
        options={{ drawerIcon: (config) => <Icon name="chat-outline" color="#fff" size={24} /> }}
      />
      <DrawerNavigator.Screen
        name={I18n.t('Technicalsupport')}
        component={SupportStackScreen}
        options={{ drawerIcon: (config) => <Icon name="account-check-outline" color="#fff" size={24} /> }}
      />
      <DrawerNavigator.Screen
        name={I18n.t('Subscription')}
        component={SubscriptionStackScreen}
        options={{ drawerIcon: (config) => <Icon name="arrow-up-bold-box-outline" color="#fff" size={24} /> }}
      />
      <DrawerNavigator.Screen
        name={I18n.t('shop')}
        component={StoreStackScreen}
        options={{ drawerIcon: (config) => <Icon name="store" color="#fff" size={24} /> }}
      />
      <DrawerNavigator.Screen
        name={I18n.t('Earnpoints')}
        component={WheelOfFortuneStackScreen}
        options={{ drawerIcon: (config) => <Icon name="gamepad" color="#fff" size={24} /> }}
      />
      <DrawerNavigator.Screen
        name={I18n.t('settings')}
        component={SettingsStackScreen}
        options={{ drawerIcon: (config) => <Icon name="cog" color="#fff" size={24} /> }}
      />
    </DrawerNavigator.Navigator>
  );
};

const UserChallengeListStackScreen = ({ navigation }) => (
  <UserChallengeListStackScreenNavigator.Navigator screenOptions={styles(navigation)}>
    <UserChallengeListStackScreenNavigator.Screen name={I18n.t('ChallengesIparticipatedin')}component={UserChallengeList} />
    <UserChallengeListStackScreenNavigator.Screen
      options={{ headerShown: false }}
      name={I18n.t('Challengeinfo')}
      component={TalentChallengeViewer}
    />
  </UserChallengeListStackScreenNavigator.Navigator>
);
const WheelOfFortuneStackScreen = ({ navigation }) => (
  <WheelOfFortuneStackScreenNavigator.Navigator screenOptions={styles(navigation)}>
    <WheelOfFortuneStackScreenNavigator.Screen name={I18n.t('spinningwheel')} component={WheelOfFortune} />
  </WheelOfFortuneStackScreenNavigator.Navigator>
);
const SettingsStackScreen = ({ navigation }) => (
  <SettingsStackScreenNavigator.Navigator screenOptions={styles(navigation)}>
    <SettingsStackScreenNavigator.Screen name={I18n.t('Settings')} component={Settings} />
  </SettingsStackScreenNavigator.Navigator>
);

const PrivateChatStackScreen = ({ navigation }) => (
  <PrivateChatStackScreenNavigator.Navigator headerMode="none">
    <PrivateChatStackScreenNavigator.Screen name={I18n.t('privatechat')} component={PrivateChatList} />
  </PrivateChatStackScreenNavigator.Navigator>
);

const SupportStackScreen = ({ navigation }) => (
  <SupportStackScreenNavigator.Navigator screenOptions={styles(navigation)}>
    <SupportStackScreenNavigator.Screen name={I18n.t('Technicalsupport')}component={Support} />
  </SupportStackScreenNavigator.Navigator>
);

const SubscriptionStackScreen = ({ navigation }) => (
  <SubscriptionStackScreenNavigator.Navigator screenOptions={styles(navigation)}>
    <SubscriptionStackScreenNavigator.Screen name={I18n.t('Subscription')} component={Subscription} />
  </SubscriptionStackScreenNavigator.Navigator>
);

const StoreStackScreen = ({ navigation }) => (
  <StoreStackScreenNavigator.Navigator screenOptions={styles(navigation)}>
    <StoreStackScreenNavigator.Screen name={I18n.t('shop')}  component={Store} />
  </StoreStackScreenNavigator.Navigator>
);

const ItemsStackScreen = ({ navigation }) => (
  <ItemsStackScreenNavigator.Navigator screenOptions={styles(navigation)}>
    <ItemsStackScreenNavigator.Screen name={I18n.t('Properties')} component={ItemsList} />
  </ItemsStackScreenNavigator.Navigator>
);

export default MainScreen;
