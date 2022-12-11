import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import StoreCard from "../../components/StoreCard";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import Fire from "../../Api/Fire";
import firebase from "firebase/app";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { displayMessage } from "../../util/extraMethods";
import I18n from '../Translation/I18n';

const GiftsStore = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [gifts, setGifts] = useState([]);
  const [user, setUser] = useState({});

  //Get Balls Store list
  useEffect(() => {
    let mounted = true;

    let subscriber = Fire.getStoreItems("GiftsStore", (items) => {
      if (mounted) {
        setGifts(items);
        setLoading(false);
      }
    });

    getUserDetails();

    return () => {
      subscriber.off();
      mounted = false;
    };
  }, []);

  const getUserDetails = async () => {
    const u = await Fire.getUser(Fire.uid);
    setUser(u);
  };

  //handle Payment
  const handlePayment = async (item) => {
    Alert.alert(
      I18n.t('alert'),
      `${I18n.t('Areyousuretobuythiswith')} ${item.price} ${I18n.t('silverball')}`,
      [
        { text: I18n.t('cancel'), style: "cancel" },
        {
          text: I18n.t('okay'),
          onPress: async () => {
            //checking if user has enough silver balls
            if (item.price > user.silverBalls) return alert(I18n.t('Youdonenoughsilballs'));

            //add item to user items list
            const res = await Fire.addToUserItems(user.uid, item);
            if (!res) return displayMessage(I18n.t('Imademistakebuyingthegift'));
            await Fire.updateUser(Fire.uid, { silverBalls: firebase.firestore.FieldValue.increment(-item.price) });
            await Fire.addTransaction({
              buyer: { id: user.uid, name: user.username, email: user.email , phone: user.phoneNumber , city:user.country },
              item: item,
              paid: true,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
            getUserDetails();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => {
    return (
      <StoreCard
        type={2}
        itemData={item}
        onPress={() => {
          item.user.uid == Fire.uid
            ? navigation.navigate(I18n.t('typepage'), { itemData: item, type: "GiftsStore" })
            : handlePayment(item);
        }}
      />
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ paddingVertical: 20, borderTopWidth: 1, borderColor: "#CED0CE" }}>
        <ActivityIndicator animating color="#fff" size="large" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <Animatable.View animation="bounceIn" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff", fontSize: 30 }}>{I18n.t('Therearenogifts')}</Text>
      </Animatable.View>
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      {user.type === "Admin" ? (
        <View style={styles.button}>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
            onPress={() => navigation.navigate(I18n.t('Creategift'))}
          >
            <LinearGradient
              colors={["#02aab0", "#00cdac"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.signIn}
            >
              <Icon name="plus" color="#fff" size={40} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : null}
      <Animatable.View animation="bounceIn" style={styles.list}>
        <FlatList
          data={gifts}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          keyExtractor={(item) => item.uid}
          numColumns={2}
        />
      </Animatable.View>
    </LinearGradient>
  );
};

export default GiftsStore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  button: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  list: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
