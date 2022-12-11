import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons as Icon } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import BallChallenge from "./BallChallenge/BallChallenge";
import ClubDrawerScreen from "./BallChallenge/ClubDrawerScreen";
import TalentChallenge from "./TalentChallenge/TalentChallenge";
import TalentChallengeViewer from "./TalentChallenge/TalentChallengeViewer";
import BestOf10 from "./BestOf10/BestOf10";
import BestOf10Viewer from "./BestOf10/BestOf10Viewer";
import CreateTalentChallenge from "./TalentChallenge/CreateTalentChallenge";
import WheelOfFortune from "./WheelOfFortune/WheelOfFortune";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { STYLES } from "../util/constants";
import I18n from '../screens/Translation/I18n';
import Store from "./Store/Store";



const BallChallengeStack = createStackNavigator();
const shopStack = createStackNavigator();
const createStack = createStackNavigator();
const TalentChallengeStack = createStackNavigator();
const BestOf10Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const styles = (navigation) => {
  return {
    ...STYLES,
    headerLeft: () => (
      <Icon.Button
        name="ios-menu"
        size={30}
        color="#fff"
        backgroundColor="transparent"
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
    ),
  };
};

const Home = ({ navigation }) => {
  return (
    <Tab.Navigator
    tabBarOptions={{
      tabStyle: { padding: 20, backgroundColor: "#4e4376" },
      showLabel: false,
      showIcon: true,
      activeTintColor: "#08d4c4",
      inactiveTintColor: "#fff",
    }}
    tabBarPosition="bottom"
    swipeEnabled={false}
    initialRouteName={I18n.t('TalentChallenge')}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = "medal";

        if (route.name === I18n.t('shop')) {
          iconName = "store";
        } else if (route.name === I18n.t('Createchallenge')) {
          iconName = "plus-square" 
          ;

        } else if (route.name === I18n.t('Choosethebest')) {
          iconName = "trophy";
        } else if (route.name === I18n.t('ballchallenge')) {
          iconName = "futbol";
        }

        return <FontAwesome name={iconName} style={{margin:-5}} size={20} color={color} />;
      },
    })}
  >
       <Tab.Screen name={I18n.t('TalentChallenge')} component={TalentChallengeStackScreen} />
      <Tab.Screen name={I18n.t('shop')}component={shopStackScreen} />
      <Tab.Screen name={I18n.t('Createchallenge')} component={CreateChallengeStackScreen} />
      <Tab.Screen name={I18n.t('ballchallenge')} component={BallChallengeStackScreen} />
      <Tab.Screen name={I18n.t('Choosethebest')} component={BestOf10StackScreen} />
    </Tab.Navigator>
  );
};

export default Home;

const shopStackScreen = ({ navigation }) => (
  <shopStack.Navigator screenOptions={styles(navigation)}>
    <shopStack.Screen name={I18n.t('shop')} component={Store} />
  </shopStack.Navigator>
);

const CreateChallengeStackScreen = ({ navigation }) => (
  <createStack.Navigator screenOptions={styles(navigation)}>
    <createStack.Screen name={I18n.t('Createchallenge')} component={CreateTalentChallenge} options={{headerShown: false}} />
  </createStack.Navigator>
);

const BallChallengeStackScreen = ({ navigation }) => (
  <BallChallengeStack.Navigator>
    <BallChallengeStack.Screen options={styles(navigation)} name={I18n.t('ballchallenge')} component={BallChallenge} />
    <BallChallengeStack.Screen
      options={{ headerShown: false }}
      name={I18n.t('Teamhomepage')}
      component={ClubDrawerScreen}
    />
  </BallChallengeStack.Navigator>
);

const TalentChallengeStackScreen = ({ navigation }) => (
  <TalentChallengeStack.Navigator>
    <TalentChallengeStack.Screen options={styles(navigation)} name={I18n.t('TalentChallenge')}component={TalentChallenge} />
    <TalentChallengeStack.Screen
      options={{ headerShown: false }}
      name={I18n.t('challengepage')}
      component={TalentChallengeViewer}
    />

    <TalentChallengeStack.Screen options={{ headerShown: false }} name={I18n.t('Createchallenge')} component={CreateTalentChallenge} />
  </TalentChallengeStack.Navigator>
);

const BestOf10StackScreen = ({ navigation }) => (
  <BestOf10Stack.Navigator>
    <BestOf10Stack.Screen options={styles(navigation)} name={I18n.t('Choosethebest')}component={BestOf10} />
    <BestOf10Stack.Screen options={STYLES} name={I18n.t('selectionpage')} component={BestOf10Viewer} />
  </BestOf10Stack.Navigator>
);

