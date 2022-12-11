import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Platform, TextInput, ActivityIndicator, Alert } from "react-native";
import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native-gesture-handler";
import * as DocumentPicker from "expo-document-picker";
import { CommonActions } from "@react-navigation/native";
import ModalSelector from "react-native-modal-selector";
import { countries } from "../../util/SelectorData";
import { Header } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import Fire from "../../Api/Fire";
import { Camera } from "expo-camera";
import { Video } from "expo-av";
import firebase from "firebase/app";
import { convertArabicNumbers, sendPushNotification } from "../../util/extraMethods";
import Dialog, {
  DialogFooter,
  DialogButton,
  SlideAnimation,
  DialogContent,
  DialogTitle,
} from "react-native-popup-dialog";
import I18n from '../Translation/I18n';

const CreateTalentChallenge = ({ route, navigation }) => {

  const talentFilter = [
    { key: 0, label: I18n.t('All')  },
    { key: 1, label: I18n.t('public') },
    { key: 2, label: I18n.t('theathlete') },
    { key: 3, label:  I18n.t('cultural') },
    { key: 4, label: I18n.t('arts')},
    { key: 5, label: I18n.t('educational') },
    { key: 6, label: I18n.t('closedchallenges') },
    { key: 7, label: I18n.t('openchallenges') },
    { key: 8, label: I18n.t('FinishedChallenges')},
    { key: 9, label: I18n.t('yourchallenges') },
    { key: 10, label: I18n.t('Favorites') },
  ];
  const talentTime = [
    { key: 0, label: I18n.t('Immediately') },
    { key: 2, label: I18n.t('aftertwohours') },
    { key: 4, label: I18n.t('after4hours') },
    { key: 8, label: I18n.t('after8hours') },
    { key: 16, label: I18n.t('after16hours')  },
    { key: 24, label: I18n.t('after24hours')  },
  ];
  




  const [user, setUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [country, setCountry] = useState(I18n.t('All'));
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [closed, setClosed] = useState(false);
  const [age, setAge] = useState(I18n.t('allages'));
  const [video, setVideo] = useState(null);
  const [challengeStartTime, setChallengeStartTime] = useState({ key: 0, label: I18n.t('Immediately') });
  const [music, setMusic] = useState({});
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState(I18n.t('All'));
  const [videoDuration, setVideoDuration] = useState(45);
  const [createChallenge, setCreateChallenge] = useState(10);
  const [challengeDuration, setChallengeDuration] = useState(24);
  const [timer, setTimer] = useState(0);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [prizes, setPrizes] = useState([
    { user: "", prize: 0 },
    { user: "", prize: 0 },
    { user: "", prize: 0 },
    { user: "", prize: 0 },
    { user: "", prize: 0 },
  ]);
  const interval = useRef(null);
  const cam = useRef(null);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      getUser();
      requestPermission();
    }

    return () => {
      interval.current != null ? clearInterval(interval.current) : null;
    };
  }, []);

  //Get permissions needed
  const requestPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
    const { status } = await Camera.requestCameraPermissionsAsync();
    //testchange requestPermissionsAsync
    setHasPermission(status === "granted");
  };

  //Get user and balls information
  const getUser = async () => {
    const u = await Fire.getUser(Fire.uid);
    const balls = await Fire.getAllBalls(u.subscription);
    setUser(u);
    setVideoDuration(parseInt(balls.talentVideoDuration || 45));
    setCreateChallenge(parseInt(balls.createTalentChallenge || 10));
    setChallengeDuration(parseInt(balls.talentDuration || 24));
  };

  //Choose video from Library
  const chooseVideoFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
      videoMaxDuration: videoDuration,
    });

    if (result.cancelled) return;
    if (result.duration / 1000 > videoDuration)
      return alert(`${I18n.t('Theduratioismorethanthetimeavailable')} ${videoDuration} ${I18n.t('second')}`);
    setVideo(Platform.OS === "ios" ? result.uri.replace("file://", "") : result.uri);
  };

  //Choose Image from Library
  const chooseImageFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (result.cancelled) return;
    setThumbnail(Platform.OS === "ios" ? result.uri.replace("file://", "") : result.uri);
  };

  //Choose music from library
  const chooseMusic = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
    if (result.type != "success" && result.type != "cancel") return alert(I18n.t('Anerroroccurredwhenselectingmusic'));
    if (result.size > 3000000) return alert(I18n.t('Anerroroccurred3MB'));
    setMusic(result);
  };

  // show alert to user that it will be charged from his silver balls count
  const showAlert = () => {
    Alert.alert(
      I18n.t('alert'),
      `${I18n.t('willbededucted')}${createChallenge}${I18n.t('Silverballsaccount')}`,
      [
        { text: I18n.t('cancel'), style: "cancel" },
        { text: I18n.t('okay'), onPress: submitChallenge },
      ],
      { cancelable: false }
    );
  };

  //Add challenge to database
  const submitChallenge = async () => {
    setLoading((prev) => true);

    if (!video) {
      setLoading((prev) => false);
      alert(I18n.t('Anerrorupload'));
      return;
    }
    if (title.trim().length == 0) {
      setLoading((prev) => false);
      alert(I18n.t('Anoccurredchallenge'));
      return;
    }
    if (prizes.some((p) => p.prize == 0) && !closed) {
      setLoading((prev) => false);
      alert(I18n.t('Aneoccurredselectprizes5winners'));
      return;
    }

    //check if balls is more than user balls
    let sum = prizes.reduce((s, a) => s + a.prize, 0);
    if (user.silverBalls < sum + createChallenge && !closed) {
      setLoading((prev) => false);
      alert(I18n.t('YourSilverBallsasasa'));
      return;
    }

    if (user.silverBalls < createChallenge && closed) {
      setLoading((prev) => false);
      alert(I18n.t('Yoursilverballsareballs'));
      return;
    }

    const response = await Fire.addChallenge({
      title: title,
      video: video,
      thumbnail: thumbnail,
      music: {
        uri: music.uri ? (Platform.OS === "ios" ? music.uri.replace("file://", "") : music.uri) : "",
        name: music.name || "",
      },
      startsIn: challengeStartTime.key,
      isClosed: closed,
      age: age,
      user: { uid: user.uid, username: user.username, image: user.image },
      prizes: prizes,
      country: country,
      category: category,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      challengeDuration: challengeDuration,
      balls: 0,
      rating: 0,
      reviews: [],
      reports: [],
    });

    if (!response) return alert(I18n.t('Errors'));

    const res = await Fire.updateUser(user.uid, {
      silverBalls: firebase.firestore.FieldValue.increment(-(sum + createChallenge)),
    });

    if (!res) return alert(I18n.t('Errors'));
     

    //send notifications to users
    
    let start = challengeStartTime.key == 0 ? I18n.t('now') : ` ${I18n.t('after')} ${challengeStartTime.key} ${I18n.t('hour')}`;
    user.friends.forEach(async (us) => {
      const u = await Fire.getUser(us);
      sendPushNotification(
        u.token,
        ` ${I18n.t('messagefrom')} ${user.username || I18n.t('Anonymous')} `,
        `${user.username || I18n.t('Anonymous')} ${I18n.t('Poschallengeanditwilstart')} ${start}`,
        ""
      );
    });
    user.favorite.forEach(async (us) => {
      const u = await Fire.getUser(us);
      sendPushNotification(
        u.token,
        `${I18n.t('messagefrom')}  ${user.username || I18n.t('Anonymous')} `,
        `${user.username || I18n.t('Anonymous')} ${I18n.t('Poschallengeanditwilstart')} ${start}`,
        ""
      );
    });
    setLoading((prev) => false);
    navigation.goBack();
  };

  useEffect(() => {
    if (isRecording) {
      startRecording();
      startTimer();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  //start recording video
  const startRecording = async () => {
    if (cam.current) {
      const video = await cam.current.recordAsync({
        quality: Camera.Constants.VideoQuality["480p"],
        maxDuration: videoDuration,
        maxDuration: 30000,

      });
      setVideo(video.uri);
    }
  };

  const startTimer = () => {
    interval.current = setInterval(() => {
      setTimer((prev) => {
        if (prev >= videoDuration) return stopRecording();
        return prev + 1;
      });
    }, 1000);
  };

  //stop recording video
  const stopRecording = async () => {
    if (cam.current) {
      setIsRecording((isRecording) => false);
      await cam.current.stopRecording();
      clearInterval(interval.current);
      setTimer((timer) => 0);
    }
  };

  //flip camera
  const flipCamera = () => {
    setIsRecording((isRecording) => false);
    setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
  };

  const handlePrize = (text, index) => {
    let p = parseInt(convertArabicNumbers(text));

    let items = [...prizes];
    let prize = { ...items[index], prize: p };
    items[index] = prize;
    setPrizes(items);
  };

  //talent options dialog footer
  const renderFooter = () => {
    return (
      <DialogFooter>
        <DialogButton align="center" textStyle={{ color: "white" }} text={I18n.t('Done')} onPress={() => setVisible(false)} />
      </DialogFooter>
    );
  };

  

  //talent options dialog
  const renderDialog = () => (
    <Dialog
      visible={visible}
      onTouchOutside={() => setVisible(false)}
      dialogStyle={{ backgroundColor: "#02aab0", width: "80%" }}
      dialogTitle={<DialogTitle style={{ backgroundColor: "#02aab0" }} align="center" title={I18n.t('Challengesettings')} />}
      dialogAnimation={new SlideAnimation({ slideFrom: "bottom" })}
      footer={renderFooter()}
      
    >
      
      <DialogContent style={styles.dialogContent}>
        <ScrollView>
          <View style={styles.action}>
            <ModalSelector
              initValueTextStyle={{ color: "#000" }}
              style={{ height: 30, width: "100%" }}
              data={countries.map((country, index) => (index == 0 ? { ...country, label: I18n.t('All') } : country))}
              initValue={I18n.t('Choosechallenge')}
              onChange={(option) => setCountry(option.label)}
              cancelText={I18n.t('Cancel')}

            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.data}>{country}</Text>
                <FontAwesome name="globe" style={{ padding: 5 }} color="#fff" size={25} />
              </View>
            </ModalSelector>
          </View>

          <View style={styles.action}>
            <ModalSelector
              initValueTextStyle={{ color: "#000" }}
              style={{ height: 30, width: "100%" }}
              data={[
                { key: false, label: I18n.t('open') },
                { key: true, label: I18n.t('closed') },
              ]}
              initValue={I18n.t('Choosethetypechallenge')}
              onChange={(option) => setClosed(option.key)}
              cancelText={I18n.t('Cancel')}

            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.data}>{closed ? I18n.t('closed') : I18n.t('open')}</Text>
                <FontAwesome name={closed ? "lock" : "unlock"} style={{ padding: 5 }} color="#fff" size={25} />
              </View>
            </ModalSelector>
          </View>

          <View style={styles.action}>
            <ModalSelector
              initValueTextStyle={{ color: "#000" }}
              style={{ height: 30, width: "100%" }}
              data={talentFilter.slice(0, 5)}
              initValue={I18n.t('Choosechallengerating')}
              onChange={(option) => setCategory(option.label)}
              cancelText={I18n.t('Cancel')}

            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.data}>{category}</Text>
                <MaterialIcons name="category" style={{ padding: 5 }} color="#fff" size={25} />
              </View>
            </ModalSelector>
          </View>

          <View style={styles.action}>
            <ModalSelector
              initValueTextStyle={{ color: "#000" }}
              style={{ height: 30, width: "100%" }}
              data={talentTime}
              initValue={I18n.t('Challengestartdate')}
              onChange={(option) => setChallengeStartTime(option)}
              cancelText={I18n.t('Cancel')}

            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.data}>{challengeStartTime.label}</Text>
                <FontAwesome name="clock-o" style={{ padding: 5 }} color="#fff" size={25} />
              </View>
            </ModalSelector>
          </View>

          <View style={styles.action}>
            <ModalSelector
              initValueTextStyle={{ color: "#000" }}
              style={{ height: 30, width: "100%" }}
              data={[
                { key: 0, label: I18n.t('Over12yearold') },
                { key: 1, label: I18n.t('Over12yearold') },
                { key: 2, label: I18n.t('Over12yearsold') },
                { key: 3, label: I18n.t('allages')  },
              ]}
              initValue={I18n.t('Therightageforthechallenge')}
              onChange={(option) => setAge(option.label)}
              cancelText={I18n.t('Cancel')}

            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.data}>{age}</Text>
                <FontAwesome name="user" style={{ padding: 5 }} color="#fff" size={25} />
              </View>
            </ModalSelector>
          </View>

          {closed ? null : (
            <>
            
              <Text style={[styles.text, { alignSelf: "center", marginVertical: 20 }]}>{I18n.t('Prizeswinners')}</Text>
              <Text style={styles.gold}> {I18n.t('yourcurrentballs')} {user ? user.silverBalls : 0}</Text>
              <TextInput
                placeholder={I18n.t('Numberfirstwinner')}
                placeholderTextColor="white"
                style={styles.title2}
                autoCapitalize="none"
                keyboardType="number-pad"
                maxLength={30}
                value={prizes[0].prize}
                onChangeText={(text) => handlePrize(text, 0)}
              />
              <TextInput
                placeholder={I18n.t('Numbersecondwinner')}
                placeholderTextColor="white"
                style={styles.title2}
                autoCapitalize="none"
                keyboardType="number-pad"
                maxLength={30}
                value={prizes[1].prize}
                onChangeText={(text) => handlePrize(text, 1)}
              />
              <TextInput
                placeholder={I18n.t('Numberthirdwinner')}
                placeholderTextColor="white"
                style={styles.title2}
                autoCapitalize="none"
                keyboardType="number-pad"
                maxLength={30}
                value={prizes[2].prize}
                onChangeText={(text) => handlePrize(text, 2)}
              />
              <TextInput
                placeholder={I18n.t('Numberfourthwinner')}
                placeholderTextColor="white"
                style={styles.title2}
                autoCapitalize="none"
                keyboardType="number-pad"
                maxLength={30}
                value={prizes[3].prize}
                onChangeText={(text) => handlePrize(text, 3)}
              />
              <TextInput
                placeholder={I18n.t('Numberfifthwinner')}
                placeholderTextColor="white"
                style={styles.title2}
                autoCapitalize="none"
                keyboardType="number-pad"
                maxLength={30}
                value={prizes[4].prize}
                onChangeText={(text) => handlePrize(text, 4)}
              />
            </>
          )}
        </ScrollView>
      </DialogContent>
    </Dialog>
  );

  //No Permission
  if (hasPermission === null) {
    return <View />;
  }

  //Permission Denied
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.camera}>
      <Header
        containerStyle={styles.header}
        placement="right"
        leftComponent={
          !video ? (
            <Ionicons.Button
              name="md-arrow-back"
              size={30}
              color="#fff"
              backgroundColor="transparent"
              onPress={() => navigation.dispatch({ ...CommonActions.goBack(), source: route.key })}
            />
          ) : null
        }
        rightComponent={
          video ? (
            <Ionicons.Button
              name="close-outline"
              size={30}
              color="#fff"
              backgroundColor="transparent"
              onPress={() => setVideo(null)}
            />
          ) : null
        }
        centerComponent={
          !video
            ? {
                text:I18n.t('Createchallenge'),
                style: { color: "#fff", fontWeight: "bold", fontSize: 20, marginTop: 10, paddingRight:30 },
              }
            : null
        }
      />

      {/*  Video View */}
      {video && !isRecording ? (
        <View style={styles.camera}>
          <Video style={styles.camera} rate={1.0} useNativeControls source={{ uri: video }} resizeMode="cover" />
          <Animatable.View style={styles.topView} animation="bounceIn">
            <View style={styles.topButtons}>
              <TouchableOpacity style={styles.icon} onPress={() => setVisible(true)}>
                <Ionicons name="options-outline" size={45} color="white" />
              </TouchableOpacity>

              {/* <TouchableOpacity style={styles.icon} onPress={chooseImageFromLibrary}>
                <Ionicons name="image" size={30} color="white" />
                <Text style={styles.music}>{I18n.t('CoverPhoto')}</Text>
              </TouchableOpacity> */}

              {/* <TouchableOpacity style={styles.icon} onPress={chooseMusic}>
                <Ionicons name="musical-notes-outline" size={30} color="white" />
                <Text style={styles.music}>{music.name ? music.name.substr(0, 15) + "..." : I18n.t('Choose')}</Text>
              </TouchableOpacity> */}
            </View>

            <TextInput
              placeholder={I18n.t('address1')}
              placeholderTextColor="#EEEEEE"
              style={styles.title}
              autoCapitalize="none"
              maxLength={30}
              value={title}
              onChangeText={(text) => setTitle(text)}
            />
          </Animatable.View>
          <Animatable.View style={styles.botView}>
            {loading ? (
              <ActivityIndicator animating color="#fff" size="large" style={{marginRight:90 }} />
            ) : (
              <View style={{ alignSelf: "center" , marginRight:90 }}>
                <TouchableOpacity
                  style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
                  onPress={showAlert}
                >
                  <LinearGradient
                    colors={["#02aab0", "#00cdac"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.confirm}
                  >
                    <MaterialCommunityIcons name="send" color="#fff" size={30} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </Animatable.View>
          {renderDialog()}
        </View>
      ) : (
        <Camera ref={cam} style={styles.camera} type={type}>
          {/*  Camera View */}
          <View style={styles.buttonContainer}>
            <Animatable.View style={styles.bottomButtons} animation="bounceIn">
              <TouchableOpacity onPress={flipCamera}>
                <Ionicons name="ios-camera-reverse" size={40} color="white" />
              </TouchableOpacity>

              {isRecording ? (
                <Animatable.View animation="bounceIn">
                  <TouchableOpacity style={styles.seconds} onPress={() => setIsRecording(false)}>
                    <Text style={styles.time}>{`${videoDuration} ${I18n.t('second')} / ${timer} ${I18n.t('second')}`}</Text>
                    <MaterialCommunityIcons name="circle-slice-8" size={80} color="red" />
                  </TouchableOpacity>
                </Animatable.View>
              ) : (
                <Animatable.View animation="bounceIn">
                  <TouchableOpacity style={styles.seconds} onPress={() => setIsRecording(true)}>
                    <Text style={styles.time}>{videoDuration} {I18n.t('second')} </Text>
                    <FontAwesome name="circle-thin" size={80} color="white" />
                  </TouchableOpacity>
                </Animatable.View>
              )}

              <TouchableOpacity onPress={chooseVideoFromLibrary}>
                <Ionicons name="ios-images" size={40} color="white" />
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </Camera>
      )}
    </View>
  );
  
};

export default CreateTalentChallenge;

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width:'110%',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    marginHorizontal: 20,
    marginTop: 60,
    marginBottom: 10,
    paddingRight:85
    
  },
  button: {
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  gold: {
    fontSize: 14,
    color: "gold",
    alignSelf: "center",
    marginBottom: 20,
  },
  dialogContent: {
    backgroundColor: "#02aab0",
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 400,
  },
  time: {
    color: "white",
  },
  seconds: {
    alignItems: "center",
  },
  topView: {
    width: "100%",
    position: "absolute",
    zIndex: 999,
    top: 90,
  },
  botView: {
    width: "100%",
    position: "absolute",
    paddingHorizontal: 30,
    zIndex: 999,
    bottom: 100,
  },
  topButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingRight: '17%'
  },
  bottomButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  header: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    position: "absolute",
    zIndex: 999,
    marginRight: '10%',

  },
  title: {
    marginHorizontal: 30,
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.5)",
    color: "#fff",
    padding: 10,
    height: 50,
    borderRadius: 10,
    alignContent:'center',
    marginRight: '25%',
    marginTop:30,
    flex: 1,
    textAlign:'center'
  },
  title2: {
    marginHorizontal: 30,
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.5)",
    color: "#fff",
    padding: 10,
    height: 50,
    borderRadius: 10,
    alignContent:'center',
    marginRight: '10%',
    marginTop:30,
    flex: 1,
    textAlign:'center'
  },
  action: {
    flexDirection: "row",
    marginTop: 20,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
  },
  data: {
    flex: 1,
    padding: 5,
    height: 30,
    color: "#fff",
  },
  confirm: {
    flexDirection: "row",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    elevation: 5,
  },
  music: {
    fontSize: 12,
    color: "#fff",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 10,
    padding: 10,
   
  },
});
