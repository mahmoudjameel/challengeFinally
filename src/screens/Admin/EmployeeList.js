import React from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

const EmployeeList = ({ navigation }) => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [error, setError] = React.useState(null);

  //Load a spinner while getting data
  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE",
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <Animatable.View animation="bounceIn">
        <ListItem
          containerStyle={{
            backgroundColor: "transparent",
            padding: 0,
            marginBottom: 20,
          }}
        >
          <LinearGradient
            style={styles.card}
            colors={["#02aab0", "#00cdac"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Avatar
              size={50}
              rounded={true}
              source={{
                uri: "https://api.adorable.io/avatars/80/abott@adorable.png",
              }}
            />
            <ListItem.Content
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingHorizontal: 10,
              }}
            >
              <View style={{ flex: 2, alignItems: "flex-start" }}>
                <ListItem.Title style={styles.time}>محمد سلطان</ListItem.Title>
                <ListItem.Subtitle style={{ color: "#fff" }}>hala@gmai.com</ListItem.Subtitle>
                <ListItem.Subtitle style={{ color: "#fff" }}>058943891</ListItem.Subtitle>
              </View>
              <View style={{ flex: 1 }}>
                <ListItem.Title style={styles.time}>دعم فني</ListItem.Title>
              </View>
            </ListItem.Content>
          </LinearGradient>
        </ListItem>
      </Animatable.View>
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      
        <Animatable.View animation="bounceIn">
          <View style={styles.button}>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
              onPress={() => {
                navigation.navigate("تسجيل موظف");
              }}
            >
              <LinearGradient
                colors={["#02aab0", "#00cdac"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.signIn}
              >
                <MaterialCommunityIcons name="plus" color="#fff" size={40} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <FlatList
            ListFooterComponent={renderFooter}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </Animatable.View>
      
    </LinearGradient>
  );
};

export default EmployeeList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 5,
    alignSelf: "center",
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
    fontSize: 18,
    color: "gold",
    fontWeight: "bold",
  },
  time: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    width: "100%",
    flexDirection: "row",
    padding: 10,
    borderRadius: 25,
  },
});
