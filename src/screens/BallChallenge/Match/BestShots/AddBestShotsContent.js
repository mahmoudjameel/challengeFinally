import React, { useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import Fire from "../../../../Api/Fire";
import firebase from "firebase/app";
import { ScrollView } from "react-native-gesture-handler";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import I18n from '../../../Translation/I18n';

const AddBestShotsContent = ({ route, navigation }) => {
  const { clubId, matchId } = route.params;
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState("");
  const [user, setUser] = useState({});
  const [balls, setBalls] = useState(20);

  //Get the permission
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }

      const user = await Fire.getUser(Fire.uid);
      const b = await Fire.getAllBalls(user.subscription);
      setBalls(parseInt(b.createBestShot || 20));
      setUser(user);
    })();
  }, []);

  //Choose photo from Library
  const choosePhotoFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.cancelled) {
      setVideo(Platform.OS === "ios" ? result.uri.replace("file://", "") : result.uri);
    }
  };

  //uploadContent
  const uploadContent = async () => {
    //show alert
    Alert.alert(
      I18n.t('alert'),
      `${I18n.t('Topostwithdrawn')} ${balls} ${I18n.t('silverball')}`,
      [
        { text: I18n.t('cancel'), style: "cancel" },
        {
          text: I18n.t('okay'),
          onPress: async () => {
            setLoading((loading) => true);

            if (balls <= user.silverBalls) {
              const response = await Fire.addBestShotContent(matchId, {
                title: title,
                type: "video/mp4",
                imageVideo: video,
                rating: 0,
                userId: user.uid,
                reviews: [],
                userName: user.username,
                userImage: user.image,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
              });

              if (!response) {
                setLoading((loading) => false);
                alert(I18n.t('Errors'));
                return;
              }

              const res = await Fire.updateUser(user.uid, {
                silverBalls: firebase.firestore.FieldValue.increment(-balls),
              });

              if (!res) {
                setLoading((loading) => false);
                alert(I18n.t('Errors'));
                return;
              }

              navigation.goBack();
            } else {
              alert(I18n.t('Youdonhaveenoughballs'));
            }

            setLoading((loading) => false);
          },
        },
      ],
      { cancelable: false }
    );
  };

  //On loading
  const renderLoading = () => {
    if (loading) {
      return <ActivityIndicator style={{ marginTop: 10 }} animating color="#fff" size="large" />;
    } else {
      return (
        <TouchableOpacity style={styles.commandButton} onPress={uploadContent}>
          <LinearGradient
            colors={["#02aab0", "#00cdac"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.linearGradient}
          >
            <Text style={styles.panelButtonTitle}>{I18n.t('Submit')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <KeyboardAvoidingView>
        <ScrollView>
          <View style={{ margin: 20 }}>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity onPress={choosePhotoFromLibrary}>
                <View style={styles.imageContainer}>
                  <ImageBackground source={{ uri: video }} style={{ height: 300, width: 300 }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                      <MaterialCommunityIcons name="camera" size={35} color="#fff" style={styles.icon} />
                    </View>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
              <Text style={styles.videoText}>{I18n.t('Clickchoosevideo')}</Text>
            </View>
            <View style={styles.action}>
              <TextInput
                placeholder={I18n.t('address1')}
                placeholderTextColor="silver"
                autoCorrect={false}
                style={styles.textInput}
                onChangeText={(text) => setTitle(text)}
                value={title}
              />
            </View>
            {renderLoading()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default AddBestShotsContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
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
  linearGradient: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    padding: 15,
    borderRadius: 10,
  },
  imageContainer: {
    height: 300,
    width: 300,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    opacity: 0.7,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
  },
  videoText: {
    color: "#fff",
    marginTop: 10,
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
});
