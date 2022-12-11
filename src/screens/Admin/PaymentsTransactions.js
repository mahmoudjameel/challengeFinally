import React, { useEffect, useState, useCallback } from "react";
import { ListItem } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Fire from "../../Api/Fire";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  RefreshControl,
} from "react-native";

const PaymentsTransactions = () => {
  const [loading, setloading] = useState(true);
  const [transactions, settransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  //Get all the transactions from database
  useEffect(() => {
    getTransactions();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing((refreshing) => true);
    setloading((loading) => true);
    getTransactions();
  }, []);

  //Get transactions
  const getTransactions = async () => {
    const trans = await Fire.getTransactions();
    settransactions((prev) => trans);
    setloading((loading) => false);
    setRefreshing((refreshing) => false);
  };

  //Display loader while getting data from database
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ paddingVertical: 20, borderTopWidth: 1, borderColor: "#CED0CE" }}>
        <ActivityIndicator animating color="#fff" size="large" />
      </View>
    );
  };

  //On swipe left
  const leftSwipe = (progress, id) => {
    const trans = progress.interpolate({ inputRange: [0, 1], outputRange: [50, 0] });
    return (
      <TouchableOpacity onPress={async () => await Fire.deleteTransaction(id)} activeOpacity={0.6}>
        <View style={styles.deleteBox}>
          <Animated.Text style={{ color: "#fff", transform: [{ translateX: trans }] }}>حذف</Animated.Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <Animatable.View animation="bounceIn" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ListItem.Title style={{ color: "#fff", fontSize: 30 }}>لا يوجد اي تحويل مالي</ListItem.Title>
      </Animatable.View>
    );
  };

  //Render List ticket
  const renderTransactions = ({ item }) => {
    return (
      <Swipeable renderLeftActions={(progress) => leftSwipe(progress, item.uid)}>
        <Animatable.View animation="bounceIn">
          <ListItem containerStyle={styles.item}>
            <LinearGradient
              style={styles.card}
              colors={["#02aab0", "#00cdac"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <ListItem.Content style={styles.content}>
                {/* Buyer Section */}
                <View style={styles.header}>
                  <ListItem.Title style={styles.title}>المشتري</ListItem.Title>
                </View>

                <View style={styles.buyer}>
                  <View style={styles.buyerInfo}>
                    <ListItem.Subtitle style={styles.text}>{item.buyer.name || "????"}</ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.text}>{item.buyer.email || "????"}</ListItem.Subtitle>
                  </View>
                  <View>
                    <ListItem.Subtitle style={styles.title}> اسم المستخدم: </ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.title}> البريد الالكتروني: </ListItem.Subtitle>
                  </View>
                </View>
                {/* Buyer Section */}

                {/* Seller Section */}
                <View style={styles.header}>
                  <ListItem.Title style={styles.title}>البائع</ListItem.Title>
                </View>

                <View style={styles.buyer}>
                  <View style={styles.buyerInfo}>
                    <ListItem.Subtitle style={styles.text}>{item.item.user.username || "????"}</ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.text}>{item.item.user.email || "????"}</ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.text}>{item.item.user.IBAN || "????"}</ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.text}>{item.item.user.phoneNumber || "????"}</ListItem.Subtitle>
                  </View>
                  <View>
                    <ListItem.Subtitle style={styles.title}> اسم المستخدم: </ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.title}> البريد الالكتروني: </ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.title}>حساب PayPal: </ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.title}>رقم الجوال:</ListItem.Subtitle>
                  </View>
                </View>
                {/* Seller Section */}
                {/* Details Section */}
                <View style={styles.header}>
                  <ListItem.Title style={styles.title}>التفاصيل</ListItem.Title>
                </View>

                <View style={styles.buyer}>
                  <View style={styles.buyerInfo}>
                    <ListItem.Subtitle style={styles.text}>
                      {item.createdAt.toDate().toDateString() || "????"}
                    </ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.text}>{item.item.amount || "????"}</ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.text}>{item.item.price || "????"}</ListItem.Subtitle>
                    
                  </View>
                  <View>
                    <ListItem.Subtitle style={styles.title}> التاريخ: </ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.title}> الكمية: </ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.title}> المبلغ: </ListItem.Subtitle>
                  </View>
                </View>
                {/* Details Section */}
              </ListItem.Content>
            </LinearGradient>
          </ListItem>
        </Animatable.View>
      </Swipeable>
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <Animatable.View animation="bounceIn">
        <FlatList
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          data={transactions}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          renderItem={renderTransactions}
          keyExtractor={(item) => item.uid}
        />
      </Animatable.View>
    </LinearGradient>
  );
};

export default PaymentsTransactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
  text: {
    fontSize: 12,
    color: "#fff",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    width: "100%",
    height: 310,
    padding: 10,
    borderRadius: 5,
  },
  deleteBox: {
    borderRadius: 5,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 310,
  },
  item: {
    backgroundColor: "transparent",
    padding: 0,
    marginBottom: 20,
  },
  content: {
    paddingHorizontal: 10,
  },
  buyer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  buyerInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  header: {
    width: "100%",
    alignItems: "center",
  },
});
