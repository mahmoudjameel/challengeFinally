import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Fire from "../../Api/Fire";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { displayMessage } from "../../util/extraMethods";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Platform,
  ActivityIndicator,
} from "react-native";

const CreateStoreGift = ({ navigation }) => {
  const [state, setstate] = useState({ loading: false, image: "", item: "", price: "", user: null });

  //Get the permission
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();

    //Get User Info
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const user = await Fire.getUser(Fire.uid);
      setstate({
        ...state,
        user: { uid: user.uid, username: user.username, image: user.image, email: user.email },
      });
    } catch (error) {
      displayMessage(error.message);
    }
  };

  //Choose photo from Library
  const choosePhotoFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.cancelled) {
      setstate({ ...state, image: Platform.OS === "ios" ? result.uri.replace("file://", "") : result.uri });
    }
  };

  //uploadContent
  const addItem = async () => {
    //check if admin data is available
    if (!state.user) {
      getUser();
      alert("لم يتم العثور على معلومات الادمن الرجاء المحاولة مره اخرى");
      return;
    }

    setstate((prevState) => {
      return { ...prevState, loading: true };
    });

    const response = await Fire.addToStore("GiftsStore", {
      image: state.image,
      user: state.user,
      name: state.item,
      amount: 1,
      price: parseInt(state.price),
    });

    setstate((prevState) => {
      return { ...prevState, loading: false };
    });

    response ? navigation.goBack() : null;
  };

  //On loading
  const renderLoading = () => {
    if (state.loading) {
      return (
        <View>
          <ActivityIndicator style={{ marginTop: 10 }} animating color="#fff" size="large" />
        </View>
      );
    } else {
      return (
        <TouchableOpacity style={styles.commandButton} onPress={addItem}>
          <LinearGradient
            colors={["#02aab0", "#00cdac"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={{ fontWeight: "bold", color: "white" }}>تأكيد</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity onPress={choosePhotoFromLibrary}>
          <View style={styles.backGroundImage}>
            <ImageBackground source={{ uri: state.image }} style={{ height: 100, width: 100 }}>
              <View style={styles.cameraView}>
                <Icon name="camera" size={20} color="#fff" style={styles.cameraIcon} />
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
        <Text style={styles.cameraText}>اضغط لتختار صورة </Text>
      </View>
      <View style={styles.action}>
        <TextInput
          placeholder="العنوان أو اسم المنتج"
          placeholderTextColor="silver"
          autoCorrect={false}
          style={styles.textInput}
          onChangeText={(text) => setstate({ ...state, item: text })}
          value={state.amount}
        />
      </View>
      <View style={styles.action}>
        <TextInput
          placeholder="السعر"
          placeholderTextColor="silver"
          autoCorrect={false}
          style={styles.textInput}
          keyboardType="numeric"
          onChangeText={(text) => setstate({ ...state, price: text })}
          value={state.price}
        />
      </View>
      {renderLoading()}
    </LinearGradient>
  );
};

export default CreateStoreGift;

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
  cameraText: {
    color: "#fff",
    marginTop: 10,
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  gradient: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    padding: 15,
    borderRadius: 10,
  },
});
