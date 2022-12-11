import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Fire from "../../Api/Fire";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ImageBackground,
  Platform,
} from "react-native";
import { convertArabicNumbers } from "../../util/extraMethods";
import I18n from '../Translation/I18n';

const EditStoreItem = ({ route, navigation }) => {
  const { itemData, type } = route.params;
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(itemData);
  const [price] = useState(type != "GiftsStore" ? itemData.amount : 0);
  const [user, setUser] = useState({});
  const [balls, setBalls] = useState(0);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
      const u = await Fire.getUser(Fire.uid);
      const ballsPoints = await Fire.getAllBalls(u.subscription);
      setUser(u);
      setBalls(parseInt(ballsPoints.minBallsToSell || 10000));
    })();
  }, []);

  //Choose photo from Library
  const choosePhotoFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.cancelled) {
      setItem({ ...item, image: Platform.OS === "ios" ? result.uri.replace("file://", "") : result.uri });
    }
  };

  //upload Item
  const editItem = async () => {
    try {
      setLoading((loading) => true);
      if (type == "BallsStore") {
        if (parseInt(item.amount) < balls) return alert(`${I18n.t('Minimumquantityforsaleis')} ${balls}`);
      }
      await Fire.updateStoreItem(type, item.uid, item, price);
      navigation.goBack();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading((loading) => false);
    }
  };

  //delete Item
  const deleteItem = async () => {
    setLoading((loading) => true);
    await Fire.deleteStoreItem(type, item);
    setLoading((loading) => false);
    navigation.goBack();
  };



  //On loading
  const renderDelete = () => {
    if (loading) {
      return (
        <View>
          <ActivityIndicator style={{ marginTop: 10 }} animating color="#fff" size="large" />
        </View>
      );
    } else {
      return (
        <TouchableOpacity style={styles.commandButton} onPress={deleteItem}>
          <LinearGradient
            colors={["#ED213A", "#fc4a1a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={{ fontWeight: "bold", color: "white" }}>{I18n.t('Delete')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <View style={{ alignItems: "center" }}>
        {type == "GiftsStore" ? (
          <TouchableOpacity onPress={choosePhotoFromLibrary}>
            <View style={styles.backGroundImage}>
              <ImageBackground source={{ uri: item.image }} style={{ height: 100, width: 100 }}>
                <View style={styles.cameraView}>
                  <Icon name="camera" size={20} color="#fff" style={styles.cameraIcon} />
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
        ) : (
          <Icon name="soccer" size={100} color="white" />
        )}
      </View>
      <View style={styles.action}>
        <TextInput
          placeholder={type == "GiftsStore" ? I18n.t('Titleproductname') : I18n.t('Quantity')}
          placeholderTextColor="silver"
          autoCorrect={false}
          style={styles.textInput}
          keyboardType={type == "GiftsStore" ? "default" : "numeric"}
          onChangeText={(text) => {
            if (type == "GiftsStore") {
              setItem({ ...item, amount: text });
            } else {
              let amount = parseFloat(convertArabicNumbers(text || "0"));
              let currentBalls = parseFloat(user.silverBalls + parseFloat(price));
              if (currentBalls < amount) return alert(I18n.t('Youdonhaveenoughballs'));
              setItem({ ...item, amount: amount });
            }
          }}
          value={`${item.amount}`}
        />
      </View>
      <View style={styles.action}>
        <TextInput
          placeholder= {I18n.t('price')}
          placeholderTextColor="silver"
          autoCorrect={false}
          style={styles.textInput}
          keyboardType="numeric"
          onChangeText={(text) => {
            let amount = parseFloat(convertArabicNumbers(text || "0"));
            setItem({ ...item, price: amount });
          }}
          value={item.price.toString()}
        />
      </View>
       {renderDelete()}
    </LinearGradient>
  );
};

export default EditStoreItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  commandButton: {
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: "#4e4376",
    paddingTop: 20,
  },
  action: {
    flexDirection: "row",
    marginTop: 20,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: "#fff",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    padding: 15,
    borderRadius: 10,
  },
  backGroundImage: {
    height: 100,
    width: 100,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    opacity: 0.7,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
  },
  cameraView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
