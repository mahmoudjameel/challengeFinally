import React from "react";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { DrawerActions } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ClubHomeScreen from "./ClubHomeScreen";
import ClubStudio from "./Studio/ClubStudio";
import AddClubStudioContent from "./Studio/AddClubStudioContent";
import ClubStudioViewer from "./Studio/ClubStudioViewer";
import ClubSchedule from "./ClubMatchSchedule";
import ClubChat from "./ClubPublicChat";
import ClubFans from "./ClubFansReport";
import ClubMatchTabScreen from "./Match/ClubMatchTabScreen";
import { ClubDrawerContent } from "./ClubDrawerContent";
import { STYLES } from "../../util/constants";
import I18n from '../Translation/I18n';

const ClubDrawer = createDrawerNavigator();
const ClubHomeStackScreenNavigator = createStackNavigator();
const ClubStudioStackScreenNavigator = createStackNavigator();
const ClubChatStackScreenNavigator = createStackNavigator();
const ClubFansStackScreenNavigator = createStackNavigator();
const ClubScheduleStackScreenNavigator = createStackNavigator();

const styles = (navigation) => {
  return {
    ...STYLES,
    headerRight: () => (
      <Ionicons.Button
        name="ios-menu"
        size={30}
        color="#fff"
        backgroundColor="transparent"
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
    ),
  };
};

const ClubDrawerScreen = ({ route, navigation }) => {
  const { clubId } = route.params;
  return (
    <ClubDrawer.Navigator
      drawerPosition="right"
      drawerContentOptions={{
        labelStyle: { color: "#fff" },
        activeBackgroundColor: "#5cbbff",
        activeTintColor: "#ffffff",
      }}
      drawerStyle={{ backgroundColor: "transparent" }}
      drawerContent={(props) => <ClubDrawerContent {...props} />}
      initialRouteName={I18n.t('Clubhomepage')}   
    >
      <ClubDrawer.Screen
        name={I18n.t('Clubhomepage')}
        initialParams={{ clubId: clubId }}
        component={ClubHomeStackScreen}
        options={{ drawerIcon: (config) => <MaterialCommunityIcons name="home" color="#fff" size={24} /> }}
      />
      <ClubDrawer.Screen
        name={I18n.t('studio')}
        initialParams={{ clubId: clubId }}
        component={ClubStudioStackScreen}
        options={{ drawerIcon: (config) => <MaterialCommunityIcons name="image-multiple" color="#fff" size={24} /> }}
      />
      <ClubDrawer.Screen
        name={I18n.t('publicchat')}
        initialParams={{ clubId: clubId }}
        component={ClubChatStackScreen}
        options={{ drawerIcon: (config) => <MaterialCommunityIcons name="forum" color="#fff" size={24} /> }}
      />
      <ClubDrawer.Screen
        name={I18n.t('fansteam')}
        initialParams={{ clubId: clubId }}
        component={ClubFansStackScreen}
        options={{ drawerIcon: (config) => <MaterialCommunityIcons name="account-group" color="#fff" size={24} /> }}
      />
      <ClubDrawer.Screen
        name={I18n.t('Teammatches')}
        initialParams={{ clubId: clubId }}
        component={ClubScheduleStackScreen}
        options={{ drawerIcon: (config) => <MaterialCommunityIcons name="calendar-multiple" color="#fff" size={24} /> }}
      />
    </ClubDrawer.Navigator>
  );
};

const ClubHomeStackScreen = ({ route, navigation }) => {
  const { clubId } = route.params;
  return (
    <ClubHomeStackScreenNavigator.Navigator screenOptions={styles(navigation)}>
      <ClubHomeStackScreenNavigator.Screen
        initialParams={{ clubId: clubId }}
        name={I18n.t('Clubhomepage')}
        component={ClubHomeScreen}
      />
    </ClubHomeStackScreenNavigator.Navigator>
  );
};

const ClubStudioStackScreen = ({ route, navigation }) => {
  const { clubId } = route.params;
  return (
    <ClubStudioStackScreenNavigator.Navigator screenOptions={styles(navigation)}>
      <ClubStudioStackScreenNavigator.Screen
        initialParams={{ clubId: clubId }}
        name={I18n.t('teamstudio')}
        component={ClubStudio}
      />
      <ClubStudioStackScreenNavigator.Screen
        initialParams={{ clubId: clubId }}
        name={I18n.t('addcontent')}
        component={AddClubStudioContent}
      />
      <ClubStudioStackScreenNavigator.Screen
        initialParams={{ clubId: clubId }}
        name={I18n.t('clipinfo')}
        component={ClubStudioViewer}
      />
    </ClubStudioStackScreenNavigator.Navigator>
  );
};

const ClubChatStackScreen = ({ route, navigation }) => {
  const { clubId } = route.params;
  return (
    <ClubChatStackScreenNavigator.Navigator screenOptions={styles(navigation)}>
      <ClubChatStackScreenNavigator.Screen
        initialParams={{ clubId: clubId }}
        name={I18n.t('publicchat')}
        component={ClubChat}
      />
    </ClubChatStackScreenNavigator.Navigator>
  );
};

const ClubScheduleStackScreen = ({ route, navigation }) => {
  const { clubId } = route.params;

  return (
    <ClubScheduleStackScreenNavigator.Navigator screenOptions={styles(navigation)}>
      <ClubScheduleStackScreenNavigator.Screen
        initialParams={{ clubId: clubId }}
        name={I18n.t('Teammatchesschedule')}
        component={ClubSchedule}
      />
      <ClubScheduleStackScreenNavigator.Screen
        initialParams={{ clubId: clubId }}
        name={I18n.t('Matchhomepage')}
        component={ClubMatchTabScreen}
      />
    </ClubScheduleStackScreenNavigator.Navigator>
  );
};

const ClubFansStackScreen = ({ route, navigation }) => {
  const { clubId } = route.params;

  return (
    <ClubFansStackScreenNavigator.Navigator screenOptions={styles(navigation)}>
      <ClubFansStackScreenNavigator.Screen
        initialParams={{ clubId: clubId }}
        name={I18n.t('fansteam')}
        component={ClubFans}
      />
    </ClubFansStackScreenNavigator.Navigator>
  );
};
export default ClubDrawerScreen;
