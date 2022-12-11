import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ClubMatchHomeScreen from "./ClubMatchHomeScreen";
import PublicChat from "./MatchPublicChat";
import ClubFansReport from "../ClubFansReport";
import MatchCommenting from "./MatchCommenting/MatchCommenting";
import MatchCommentorViewer from "./MatchCommenting/MatchCommentorViewer";
import CreateMatchCommenting from "./MatchCommenting/CreateMatchCommenting";
import MatchRefereeMistakeViewer from "./RefereeMistakes/MatchRefereeMistakeViewer";
import MatchRefereeMistake from "./RefereeMistakes/MatchRefereeMistake";
import AddRefereeMistakesContent from "./RefereeMistakes/AddRefereeMistakesContent";
import BestShots from "./BestShots/BestShots";
import BestShotsViewer from "./BestShots/BestShotsViewer";
import AddBestShotsContent from "./BestShots/AddBestShotsContent";
import MatchAnalysisViewer from "./MatchAnalysis/MatchAnalysisViewer";
import CreateMatchAnalysis from "./MatchAnalysis/CreateMatchAnalysis";
import MatchAnalysis from "./MatchAnalysis/MatchAnalysis";
import I18n from '../../../screens/Translation/I18n';

const ClubMatchHomeScreenStack = createStackNavigator();
const ClubFansReportStack = createStackNavigator();
const PublicChatStack = createStackNavigator();
const MatchRefereeMistakeStack = createStackNavigator();
const BestShotsStack = createStackNavigator();
const MatchAnalysisStack = createStackNavigator();
const ClubMatchCommentingStackScreenNavigator = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const ClubMatchTabScreen = ({ route, navigation }) => {
  const { clubId, matchId } = route.params;
  return (
    <Tab.Navigator
      tabBarOptions={{
        tabStyle: { padding: 20, backgroundColor: "#2b5876" },
        showLabel: true,
        showIcon: true,
        activeTintColor: "#08d4c4",
        inactiveTintColor: "#fff",
        scrollEnabled: true,
      }}
      swipeEnabled={false}
      initialRouteName={I18n.t('Homepage')}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "home";

          if (route.name === I18n.t('ViewersInformation')) {
            iconName = "account-group";
          } else if (route.name === I18n.t('publicconversations')) {
            iconName = "forum";
          } else if (route.name === I18n.t('Arbitrationerrors')) {
            iconName = "account-remove";
          } else if (route.name === I18n.t('bestshots')) {
            iconName = "camera";
          } else if (route.name === I18n.t('sportscommentary')) {
            iconName = "account-tie";
          } else if (route.name === I18n.t('MatchAnalysis')) {
            iconName = "chart-line";
          }
          return <MaterialCommunityIcons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('Homepage')}
        component={ClubMatchHomeScreenStackScreen}
      />
      <Tab.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('publicconversations')}
        component={PublicChatStackScreen}
      />
      <Tab.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('Arbitrationerrors')}
        component={MatchRefereeMistakeStackScreen}
      />
      <Tab.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('bestshots')}
        component={BestShotsStackScreen}
      />
      <Tab.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('sportscommentary')}
        component={ClubMatchCommentingStackScreen}
      />
      <Tab.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('MatchAnalysis')}
        component={MatchAnalysisStackScreen}
      />
      <Tab.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('ViewersInformation')}
        component={ClubFansReportStackScreen}
      />
    </Tab.Navigator>
  );
};

export default ClubMatchTabScreen;

const ClubMatchHomeScreenStackScreen = ({ route, navigation }) => {
  const { clubId, matchId } = route.params;

  return (
    <ClubMatchHomeScreenStack.Navigator headerMode="none">
      <ClubMatchHomeScreenStack.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('Homepage')}
        component={ClubMatchHomeScreen}
      />
    </ClubMatchHomeScreenStack.Navigator>
  );
};
const ClubFansReportStackScreen = ({ route, navigation }) => {
  const { clubId, matchId } = route.params;

  return (
    <ClubFansReportStack.Navigator headerMode="none">
      <ClubFansReportStack.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('ViewersInformation')}
        component={ClubFansReport}
      />
    </ClubFansReportStack.Navigator>
  );
};
const MatchAnalysisStackScreen = ({ route, navigation }) => {
  const { clubId, matchId } = route.params;

  return (
    <MatchAnalysisStack.Navigator headerMode="none">
      <MatchAnalysisStack.Screen
        name={I18n.t('MatchAnalysis')}
        component={MatchAnalysis}
        initialParams={{ clubId: clubId, matchId: matchId }}
      />
      <MatchAnalysisStack.Screen
        name={I18n.t('Analysispage')}
        component={MatchAnalysisViewer}
        initialParams={{ clubId: clubId, matchId: matchId }}
      />
      <MatchAnalysisStack.Screen
        name={I18n.t('Creatmathematicalanalysis')}
        component={CreateMatchAnalysis}
        initialParams={{ clubId: clubId, matchId: matchId }}
      />
    </MatchAnalysisStack.Navigator>
  );
};

const PublicChatStackScreen = ({ route, navigation }) => {
  const { clubId, matchId } = route.params;

  return (
    <PublicChatStack.Navigator headerMode="none">
      <PublicChatStack.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('publicconversations')}
        component={PublicChat}
      />
    </PublicChatStack.Navigator>
  );
};

const MatchRefereeMistakeStackScreen = ({ route, navigation }) => {
  const { clubId, matchId } = route.params;

  return (
    <MatchRefereeMistakeStack.Navigator headerMode="none">
      <MatchRefereeMistakeStack.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('Arbitrationerrors')}
        component={MatchRefereeMistake}
      />
      <ClubMatchCommentingStackScreenNavigator.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('arbitrationerrorpage')}
        component={MatchRefereeMistakeViewer}
      />
      <ClubMatchCommentingStackScreenNavigator.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('Publicationarbitralerror')}
        component={AddRefereeMistakesContent}
      />
    </MatchRefereeMistakeStack.Navigator>
  );
};

const BestShotsStackScreen = ({ route, navigation }) => {
  const { clubId, matchId } = route.params;

  return (
    <BestShotsStack.Navigator headerMode="none">
      <BestShotsStack.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('bestshots')}
        component={BestShots}
      />
      <BestShotsStack.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('shotpage')}
        component={BestShotsViewer}
      />
      <BestShotsStack.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('Postshot')}
        component={AddBestShotsContent}
      />
    </BestShotsStack.Navigator>
  );
};

const ClubMatchCommentingStackScreen = ({ route, navigation }) => {
  const { clubId, matchId } = route.params;

  return (
    <ClubMatchCommentingStackScreenNavigator.Navigator headerMode="none">
      <ClubMatchCommentingStackScreenNavigator.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('sportscommentary')}
        component={MatchCommenting}
      />
      <ClubMatchCommentingStackScreenNavigator.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('CreateComment')}
        component={CreateMatchCommenting}
      />
      <ClubMatchCommentingStackScreenNavigator.Screen
        initialParams={{ clubId: clubId, matchId: matchId }}
        name={I18n.t('Commentpage')}
        component={MatchCommentorViewer}
      />
    </ClubMatchCommentingStackScreenNavigator.Navigator>
  );
};
