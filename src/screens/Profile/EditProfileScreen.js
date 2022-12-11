import React, { useEffect, useState, createRef } from "react";
import { MaterialCommunityIcons, FontAwesome, Feather } from "@expo/vector-icons";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import { displayMessage } from "../../util/extraMethods";
import { LinearGradient } from "expo-linear-gradient";
import Fire from "../../Api/Fire";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import I18n from '../Translation/I18n';

const EditProfileScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [user, setUser] = useState({});
  const [old, setOld] = useState("");
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(true);
  const bs = createRef();
  const fall = new Animated.Value(1);

  //Get User Information
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to be able to change profile picture");
        }
      }

      const user = await Fire.getUser(userId);
      setUser(user);
      setOld(user.image);
    })();
  }, []);

  //Update User
  const updateUser = async () => {
    setLoading((prevState) => true);
    let u = user;

    if (old !== u.image) {
      const img = await Fire.uploadMedia(`User/images/${u.uid}`, u.image, "image/jpeg");
      u.image = img;
    }

    //Update userImage in other user's chatroom
    if (u.chatRooms) {
      Object.keys(u.chatRooms).forEach(async (user) => {
        const obj = await Fire.getUser(user);
        await Fire.updateUser(user, {
          ["chatRooms." + u.uid]: {
            roomId: obj.chatRooms[u.uid].roomId,
            unseen: obj.chatRooms[u.uid].unseen,
            userId: obj.chatRooms[u.uid].userId,
            userImage: img,
            userName: obj.chatRooms[u.uid].userName,
          },
        });
      });
    }

    //Update image for this user
    const response = await Fire.updateUser(u.uid, u);
    if (response) {
      setLoading((prevState) => false);
      displayMessage(I18n.t('Yourdatahasbeensuccessfully'));
      navigation.goBack();
    }
  };

  //Take photo from camra
  const takePhotoFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.cancelled) {
      bs.current.snapTo(1);
      const image = Platform.OS === "ios" ? result.uri.replace("file://", "") : result.uri;
      setUser({ ...user, image: image });
      setDisplay(true);
    }
  };

  //Choose photo from Library
  const choosePhotoFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.cancelled) {
      bs.current.snapTo(1);
      const image = Platform.OS === "ios" ? result.uri.replace("file://", "") : result.uri;
      setUser({ ...user, image: image });
      setDisplay(true);
    }
  };

  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.panelTitle}>{I18n.t('uploadphoto')}</Text>
        <Text style={styles.panelSubtitle}>{I18n.t('PleasechooseanimagelesthanMBuploading')}</Text>
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
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  const renderLoading = () => {
    if (loading) {
      return (
        <View>
          <ActivityIndicator style={{ marginTop: 20 }} animating color="#fff" size="large" />
        </View>
      );
    } else {
      return (
        <TouchableOpacity style={styles.commandButton} onPress={updateUser}>
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
      <BottomSheet
        ref={bs}
        snapPoints={[330, 0]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledContentTapInteraction={false}
        enabledGestureInteraction={false}
        enabledInnerScrolling={true}
        enabledContentGestureInteraction={true}
      />
      {display ? (
        <Animated.View
          style={{
            margin: 20,
            flex: 1,
            justifyContent: "center",
            opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => {
                bs.current.snapTo(0);
                setDisplay(false);
              }}
            >
              <View
                style={{ height: 100, width: 100, borderRadius: 15, justifyContent: "center", alignItems: "center" }}
              >
                <ImageBackground
                  source={{ url: user.image || "" }}
                  style={{ height: 100, width: 100 }}
                  imageStyle={{ borderRadius: 15 }}
                >
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <MaterialCommunityIcons name="camera" size={35} color="#fff" style={styles.icon} />
                  </View>
                </ImageBackground>
              </View>
            </TouchableOpacity>
            <Text style={{ color: "#fff", marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
              {user.username || "????"}
            </Text>
          </View>
          {user.type === "Adult" ? (
            <View style={styles.action}>
              <FontAwesome name="user-o" color="#fff" size={20} />
              <TextInput
                placeholder={I18n.t('FullName')}
                placeholderTextColor="silver"
                autoCorrect={false}
                style={styles.textInput}
                onChangeText={(text) => setUser({ ...user, name: text })}
                value={user.name}
              />
            </View>
          ) : null}

          <View style={styles.action}>
            <FontAwesome name="user-o" color="#fff" size={20} />
            <TextInput
              placeholder={I18n.t('UserName')}
              placeholderTextColor="silver"
              autoCorrect={false}
              style={styles.textInput}
              onChangeText={(text) => setUser({ ...user, username: text })}
              value={user.username}
            />
          </View>

          {user.type === "Adult" ? (
            <View style={styles.action}>
              <Feather name="phone" color="#fff" size={20} />
              <TextInput
                placeholder={I18n.t('Phone')}
                placeholderTextColor="silver"
                keyboardType="number-pad"
                autoCorrect={false}
                style={styles.textInput}
                onChangeText={(text) => setUser({ ...user, phoneNumber: text })}
                value={user.phoneNumber}
              />
            </View>
          ) : null}

          <View style={styles.action}>
            <FontAwesome name="paypal" color="#fff" size={20} />
            <TextInput
              placeholder={I18n.t('PayPalaccount')}
              placeholderTextColor="silver"
              autoCorrect={false}
              style={styles.textInput}
              onChangeText={(text) => setUser({ ...user, IBAN: text })}
              value={user.IBAN}
            />
          </View>
          <View style={styles.action}>
            <TextInput
              placeholder={I18n.t('yourbio')}
              placeholderTextColor="silver"
              autoCorrect={false}
              multiline={true}
              numberOfLines={6}
              style={styles.textInput}
              onChangeText={(text) => setUser({ ...user, view: text })}
              value={user.view}
            />
          </View>
          {renderLoading()}
        </Animated.View>
      ) : null}
    </LinearGradient>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  panelSubtitle: {
    fontSize: 14,
    color: "silver",
    height: 30,
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
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
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
  icon: {
    opacity: 0.7,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
  },
});
