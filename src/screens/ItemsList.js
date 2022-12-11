import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet, Text, ActivityIndicator, Alert, RefreshControl } from "react-native";
import StoreCard from "../components/StoreCard";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import Fire from "../Api/Fire";
import firebase from "firebase/app";
import { displayMessage } from "../util/extraMethods";
import I18n from '../screens/Translation/I18n';

const ItemsList = ({ navigation }) => {
  const [state, setState] = useState({ loading: true, items: [] });
  const [refreshing, setRefreshing] = useState(false);

  //Get items list
  useEffect(() => {
    let mounted = true;
    if (mounted) getItems();
    return () => (mounted = false);
  }, []);

  const getItems = async () => {
    const items = await Fire.getUserItems(Fire.uid);
    setState((prevState) => {
      return { ...prevState, loading: false, items: items };
    });
    setRefreshing((refreshing) => false);
  };

  const onRefresh = useCallback(() => {
    setRefreshing((refreshing) => true);
    getItems();
  }, []);

  const transferToBalls = (item) => {
    Alert.alert(
      I18n.t('alert'),
      `${I18n.t('Doyoutogiftbe')} ${item.price / 2} ${I18n.t('ball')}`,
      [
        { text: I18n.t('cancel'), style: "cancel" },
        {
          text: I18n.t('okay'),
          onPress: async () => {
            let res = null;
            if (item.amount > 1) {
              res = await Fire.updateUserItem(Fire.uid, `${item.uid}-${item.user.uid}`, {
                amount: firebase.firestore.FieldValue.increment(-1),
              });
            } else {
              res = await Fire.deleteFromUserItems(Fire.uid, `${item.uid}-${item.user.uid}`);
            }
            if (res) {
              await Fire.updateUser(Fire.uid, { silverBalls: firebase.firestore.FieldValue.increment(item.price / 2) });
            } else {
              displayMessage(I18n.t('Therewasanballs'));
            }
            getItems();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => {
    return <StoreCard type={2} itemData={item} onPress={() => transferToBalls(item)} />;
  };

  const renderFooter = () => {
    if (!state.loading) return null;
    return (
      <View style={{ paddingVertical: 20, borderTopWidth: 1, borderColor: "#CED0CE" }}>
        <ActivityIndicator animating color="#fff" size="large" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (state.loading) return null;
    return (
      <Animatable.View animation="bounceIn" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff", fontSize: 30 }}>{I18n.t('Therearenoitems')}</Text>
      </Animatable.View>
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <Animatable.View style={styles.list} animation="bounceIn">
        <FlatList
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          data={state.items}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          keyExtractor={(item) => item.uid}
          numColumns={2}
        />
      </Animatable.View>
    </LinearGradient>
  );
};

export default ItemsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  signIn: {
    flexDirection: "row",
    width: "16%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    elevation: 5,
  },
});
