import React, { useState, useEffect, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import BottomSheet from "reanimated-bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import Animated from "react-native-reanimated";
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


const AddRefereeMistakesContent = ({ route, navigation }) => {
  const { clubId, matchId } = route.params;
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [imageVideo, setImageVideo] = useState("");
  const [type, setType] = useState("image/jpeg");
  const [user, setUser] = useState({});
  const [balls, setBalls] = useState(10);
  const [display, setDisplay] = useState(true);
  const bs = useRef();
  const fall = new Animated.Value(1);

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
      setBalls(parseInt(b.refreeMistakes || 10));
      setUser(user);
    })();
  }, []);

  //Take photo from camra
  const takePhotoFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.cancelled) {
      setImageVideo(Platform.OS === "ios" ? result.uri.replace("file://", "") : result.uri);
      setType(result.type == "video" ? "video/mp4" : "image/jpeg");
      bs.current.snapTo(1);
      setDisplay(true);
    }
  };

  //Choose photo from Library
  const choosePhotoFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.cancelled) {
      setImageVideo(Platform.OS === "ios" ? result.uri.replace("file://", "") : result.uri);
      setType(result.type == "video" ? "video/mp4" : "image/jpeg");
      bs.current.snapTo(1);
      setDisplay(true);
    }
  };

  //uploadContent
  const uploadContent = async () => {
    //show alert
    Alert.alert(
      I18n.t('alert'),
      `${I18n.t('Topostwithdrawn')} ${balls} ${I18n.t('silvers')}`,
      [
        { text: I18n.t('cancel'), style: "cancel" },
        {
          text: I18n.t('okay'),
          onPress: async () => {
            setLoading((loading) => true);

            if (balls <= user.silverBalls) {
              const response = await Fire.addRefereeMistakesContent(matchId, {
                title: title,
                type: type,
                imageVideo: imageVideo,
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

  const renderInner = () => (
    <ScrollView contentContainerStyle={styles.panel}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.panelTitle}>{I18n.t('Photoshoot')}</Text>
      </View>
      <TouchableOpacity style={styles.panelButton} onPress={takePhotoFromCamera}>
        <Text style={styles.panelButtonTitle}>{I18n.t('Photoshoot')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton} onPress={choosePhotoFromLibrary}>
        <Text style={styles.panelButtonTitle}>{I18n.t('Choosefromthestudio')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => {
          bs.current.snapTo(1);
          setDisplay(true);
        }}
      >
        <Text style={styles.panelButtonTitle}>{I18n.t('Cancel')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <BottomSheet
        ref={bs}
        snapPoints={[330, 0]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledContentTapInteraction={false}
        enabledGestureInteraction={false}
      />
      {display ? (
        <KeyboardAvoidingView>
          <ScrollView>
            <Animated.View style={{ margin: 20, opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)) }}>
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    bs.current.snapTo(0);
                    setDisplay(false);
                  }}
                >
                  <View style={styles.imageContainer}>
                    <ImageBackground source={{ uri: imageVideo }} style={{ height: 300, width: 300 }}>
                      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <MaterialCommunityIcons name="camera" size={35} color="#fff" style={styles.icon} />
                      </View>
                    </ImageBackground>
                  </View>
                </TouchableOpacity>
                <Text style={styles.videoText}>{I18n.t('Clickchoosephovideo')}</Text>
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
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : null}
    </LinearGradient>
  );
};

export default AddRefereeMistakesContent;

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
  header: {
    backgroundColor: "#4e4376",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 5,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
    color: "#fff",
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#2b5876",
    alignItems: "center",
    marginVertical: 7,
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
  button: {
    alignItems: "center",
    marginTop: 40,
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
