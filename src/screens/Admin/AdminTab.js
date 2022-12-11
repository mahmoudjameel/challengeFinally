import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import AdminMainscreen from "./AdminMainscreen";
import CustomersTicketIssue from "./CustomersTicketIssue";
import RegisterEmployee from "./RegisterEmployee";
import PaymentsTransactions from "./PaymentsTransactions";
import EditStoreItem from "../Store/EditStoreItem";
import CreateStoreGift from "./CreateStoreGift";
import GiftsStore from "../Store/GiftsStore";
import EmployeeList from "./EmployeeList";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Fire from "../../Api/Fire";
import { STYLES } from "../../util/constants";
import I18n from '../Translation/I18n';

const styles = (navigation) => {
  return {
    ...STYLES,
    headerLeft: () => (
      <MaterialCommunityIcons.Button
        name="exit-to-app"
        size={30}
        color="#fff"
        backgroundColor="transparent"
        onPress={() => Fire.signOut(navigation)}
      />
    ),
  };
};

const CustomersTicketIssueStack = createStackNavigator();
const RegisterEmployeeStack = createStackNavigator();
const AdminMainscreenStack = createStackNavigator();
const PaymentsTransactionsStack = createStackNavigator();
const GiftStoreStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

//Admin tab screen
const AdminTab = ({ navigation }) => {
  return (
    <Tab.Navigator
      labeled={false}
      barStyle={{ backgroundColor: "#4e4376" }}
      activeColor="#08d4c4"
      inactiveColor="#fff"
      initialRouteName={I18n.t('Homepage')}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "home";

          if (route.name === I18n.t('StaffList')) {
            iconName = "account-tie";
          } else if (route.name === I18n.t('Technicalusers')) {
            iconName = "account-clock";
          } else if (route.name === I18n.t('ballmanagement')) {
            iconName = "soccer";
          } else if (route.name === I18n.t('Transfers')) {
            iconName = "receipt";
          } else if (route.name ===  I18n.t('Giftshop')) {
            iconName = "store";
          }

          return <MaterialCommunityIcons name={iconName} size={25} color={color} />;
        },
      })}
    >
      <Tab.Screen name={I18n.t('Homepage')} component={AdminMainscreenStackScreen} />
      <Tab.Screen name={I18n.t('StaffList')} component={RegisterEmployeeStackScreen} />
      <Tab.Screen name={I18n.t('Technicalusers')} component={CustomersTicketIssueStackScreen} />
      <Tab.Screen name={I18n.t('Transfers')} component={PaymentsTransactionsStackScreen} />
      <Tab.Screen name={ I18n.t('Giftshop')} component={GiftStoreStackScreen} />
    </Tab.Navigator>
  );
};

export default AdminTab;

const CustomersTicketIssueStackScreen = ({ navigation }) => (
  <CustomersTicketIssueStack.Navigator screenOptions={styles(navigation)}>
    <CustomersTicketIssueStack.Screen name={I18n.t('Technicalusers')} component={CustomersTicketIssue} />
  </CustomersTicketIssueStack.Navigator>
);

const RegisterEmployeeStackScreen = ({ navigation }) => (
  <RegisterEmployeeStack.Navigator screenOptions={styles(navigation)}>
    <RegisterEmployeeStack.Screen name={I18n.t('StaffList')} component={EmployeeList} />
    <RegisterEmployeeStack.Screen name={I18n.t('employeeregistration')}  component={RegisterEmployee} />
  </RegisterEmployeeStack.Navigator>
);

const AdminMainscreenStackScreen = ({ navigation }) => (
  <AdminMainscreenStack.Navigator screenOptions={styles(navigation)}>
    <AdminMainscreenStack.Screen name={I18n.t('Homepage')} component={AdminMainscreen} />
  </AdminMainscreenStack.Navigator>
);

const PaymentsTransactionsStackScreen = ({ navigation }) => (
  <PaymentsTransactionsStack.Navigator screenOptions={styles(navigation)}>
    <PaymentsTransactionsStack.Screen name={I18n.t('Transfers')} component={PaymentsTransactions} />
  </PaymentsTransactionsStack.Navigator>
);

const GiftStoreStackScreen = ({ navigation }) => (
  <GiftStoreStack.Navigator>
    <GiftStoreStack.Screen options={styles(navigation)} name={ I18n.t('Giftshop')} component={GiftsStore} />
    <GiftStoreStack.Screen options={STYLES} name={ I18n.t('Creategift')}  component={CreateStoreGift} />
    <GiftStoreStack.Screen options={STYLES} name={ I18n.t('typepage')} component={EditStoreItem} />
  </GiftStoreStack.Navigator>
);
