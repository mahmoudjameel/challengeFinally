import React, { useState, useCallback, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Actions, Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Video, Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import { displayMessage } from "../util/extraMethods";
import { TouchableOpacity } from "react-native-gesture-handler";
import AudioSlider from "../components/AudioSlider";
import Fire from "../Api/Fire";
import ImageView from "react-native-image-viewing";
import firebase from "firebase/app";
import {
  StyleSheet,
  View,
  Platform,
  Dimensions,
  Text,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import I18n from '../screens/Translation/I18n';

const { height, width } = Dimensions.get("screen");

const Chat = ({ navigation, type, clubId, roomId, secUserId, matchId }) => {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [user, setUser] = useState({});
  const [media, setMedia] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [image, setImage] = useState("");
  const isMounted = useRef(true);
  const [visible, setVisible] = useState(false);

  //Get club chat
  useEffect(() => {
    isMounted.current = true;
    let subscriber = null;

    //Get the permission
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING, Permissions.MEDIA_LIBRARY);
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }

      //Get user's information & Chat Messages
      if (isMounted.current) {
        const user = await Fire.getUser(Fire.uid);
        setUser(user);
        if (type == "Club-Chat") {
          subscriber = Fire.getClubChat(clubId, (messages) => {
            appendMessages(messages);
          });
        } else if (type == "Match-Chat") {
          subscriber = Fire.getMatchChat(matchId, (messages) => {
            appendMessages(messages);
          });
        } else {
          subscriber = Fire.getPrivateChat(roomId, (messages) => {
            appendMessages(messages);
            (async () => {
              await Fire.updateUser(Fire.uid, {
                ["chatRooms." + secUserId]: {
                  roomId: user[`chatRooms`][secUserId].roomId,
                  unseen: 0,
                  userId: user[`chatRooms`][secUserId].userId,
                  userImage: user[`chatRooms`][secUserId].userImage,
                  userName: user[`chatRooms`][secUserId].userName,
                },
              });
            })();
          });
        }
      }
    })();

    // Stop listening for updates
    return () => {
      subscriber ? subscriber.off() : null;
      isMounted.current = false;
    };
  }, []);

  //Take photo from Library
  const takePhotoFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        user.subscription != "Bronze" ? ImagePicker.MediaTypeOptions.All : ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.cancelled) {
      result.type == "image" ? handleSendImage(result) : handleSendVideo(result);
    }
  };

  const audioSettings = JSON.parse(
    JSON.stringify(
      (Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY = {
        android: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      })
    )
  );

  //recordAudio
  const startRecording = async () => {
    // stop playback
    if (sound !== null) {
      await sound.unloadAsync();
      sound.setOnPlaybackStatusUpdate(null);
      setSound(null);
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    const _recording = new Audio.Recording();
    try {
      await _recording.prepareToRecordAsync(audioSettings);
      setRecording(_recording);
      await _recording.startAsync();
      setIsRecording(true);
    } catch (error) {
      displayMessage(`${I18n.t('Errors')}: ${error.message}`);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
    const info = await FileSystem.getInfoAsync(recording.getURI());
    console.log(`FILE INFO: ${JSON.stringify(info)}`);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    const { sound: _sound, status } = await recording.createNewLoadedSoundAsync({
      isLooping: true,
      isMuted: false,
      volume: 1.0,
      rate: 1.0,
      shouldCorrectPitch: true,
    });
    setSound(_sound);
    setIsRecording(false);
    handleSendVoice();
  };

  //Append new message to Messages
  const appendMessages = useCallback(
    (messages) => {
      setMessages((previousMessages) => GiftedChat.append([], messages));
    },
    [messages]
  );

  //Send Message
  const onSend = useCallback(async (message = []) => {
    if (isMounted.current) {
      if (type == "Club-Chat") {
        message.forEach((msg) => {
          msg.createdAt = firebase.database.ServerValue.TIMESTAMP;
          Fire.sendMessage(1, clubId, msg, null);
        });
      } else if (type == "Match-Chat") {
        message.forEach((msg) => {
          msg.createdAt = firebase.database.ServerValue.TIMESTAMP;
          Fire.sendMessage(2, matchId, msg, null);
        });
      } else {
        message.forEach((msg) => {
          msg.seen = false;
          msg.createdAt = firebase.database.ServerValue.TIMESTAMP;
          Fire.sendMessage(3, roomId, msg, secUserId);
        });
      }
    }
  }, []);

  //Send Images
  const handleSendImage = async (image) => {
    try {
      const img = await Fire.uploadMedia(
        `Chat/images/${uuidv4()}`,
        Platform.OS === "ios" ? image.uri.replace("file://", "") : image.uri,
        "image/jpeg"
      );

      let message = {
        _id: uuidv4(),
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        user: { _id: user.uid, name: user.username, avatar: user.image },
        image: img,
        messageType: "image",
        seen: false,
      };

      setMedia(message);
      setShowPreview(true);
    } catch (error) {
      alert(`${I18n.t('Anerroerror')} ${error.message}`);
    }
  };

  //Send Videos
  const handleSendVideo = async (video) => {
    try {
      const vid = await Fire.uploadMedia(
        `Chat/videos/${uuidv4()}`,
        Platform.OS === "ios" ? video.uri.replace("file://", "") : video.uri,
        "video/mp4"
      );

      let message = {
        _id: uuidv4(),
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        user: { _id: user.uid, name: user.username, avatar: user.image },
        video: vid,
        messageType: "video",
        seen: false,
      };

      setMedia(message);
      setShowPreview(true);
    } catch (error) {
      alert(`${I18n.t('Anerroerror')} ${error.message}`);
    }
  };

  //Send Voice Messages
  const handleSendVoice = async () => {
    const voice = await Fire.uploadMedia(`Chat/voice/${uuidv4()}`, recording.getURI(), "audio/m4a");

    let message = {
      _id: uuidv4(),
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      user: { _id: user.uid, name: user.username, avatar: user.image },
      voice: voice,
      messageType: "voice",
      seen: false,
    };
    onSend([message]);
  };

  //render media preview
  const renderPreview = (media) => {
    return (
      <View style={styles.preview}>
        <TouchableOpacity
          onPress={() => {
            setMedia("");
            setShowPreview(false);
          }}
        >
          <MaterialCommunityIcons name="close" size={30} color="#000" style={{ alignSelf: "flex-end" }} />
        </TouchableOpacity>

        {media.messageType == "video" ? (
          <Video
            style={styles.videoPreview}
            rate={1.0}
            volume={1.0}
            shouldPlay={true}
            useNativeControls={true}
            source={{ uri: media.video }}
            resizeMode="contain"
          />
        ) : (
          <Image height={200} width={200} style={styles.imagePreview} source={{ uri: media.image }} />
        )}

        <TouchableOpacity
          onPress={() => {
            onSend([media]);
            setMedia("");
            setShowPreview(false);
          }}
        >
          <MaterialCommunityIcons name="send-circle" size={50} color="#000" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderActions = (props) => {
    return (
      <Actions
        {...props}
        containerStyle={{ marginHorizontal: 35 }}
        icon={() => (
          <View style={{ flexDirection: "row", width: 40 }}>
            <MaterialCommunityIcons
              name="camera"
              size={25}
              color="grey"
              font="FontAwesome"
              onPress={takePhotoFromLibrary}
            />
            {Platform.OS === "android" ? (
              user.subscription != "Bronze" ? (
                <TouchableOpacity
                  style={{ paddingHorizontal: 6 }}
                  onPressIn={startRecording}
                  onPressOut={stopRecording}
                >
                  {isRecording ? (
                    <MaterialCommunityIcons name="microphone" size={25} color="green" font="FontAwesome" />
                  ) : (
                    <MaterialCommunityIcons name="microphone" size={25} color="grey" font="FontAwesome" />
                  )}
                </TouchableOpacity>
              ) : null
            ) : null}
          </View>
        )}
      />
    );
  };

  const renderName = (props) => {
    const { user = {} } = props.currentMessage;
    const { user: pUser = {} } = props.previousMessage;
    const isSameUser = pUser._id === user._id;
    const shouldNotRenderName = isSameUser;
    let username = user.username;
    return shouldNotRenderName ? (
      <View />
    ) : (
      <View>
        <Text style={{ color: "grey", padding: 2, alignSelf: "center" }}>{username}</Text>
      </View>
    );
  };

  const renderAudio = (props) => {
    return !props.currentMessage.voice ? (
      <View />
    ) : (
      <View
        style={[
          styles.StandardContainer,
          { flex: 0, flexDirection: "column", justifyContent: "flex-start", marginTop: 20, marginBottom: 5 },
        ]}
      >
        <View style={{ flex: 0, flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.StandardText, { flex: 5 }]}>Audio</Text>
        </View>

        <AudioSlider audio={props.currentMessage.voice} />
      </View>
    );
  };

  const renderMessageImage = (props) => {
    // Image.prefetch(props.currentMessage.image);

    return (
      <TouchableOpacity
        style={{ borderRadius: 15, padding: 5 }}
        onPress={() => {
          setVisible(true);
          setImage(props.currentMessage.image);
        }}
      >
        <Image
          key={props.currentMessage._id}
          style={{ height: 200, width: 200, padding: 20, borderRadius: 15 }}
          source={{ uri: props.currentMessage.image }}
        />
      </TouchableOpacity>
    );
  };

  const customtInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{ marginTop: 50, borderRadius: 35, backgroundColor: "white" }}
        renderActions={renderActions}
      />
    );
  };

  const renderSend = (props) => {
    const { text, messageIdGenerator, user, onSend } = props;
    return (
      <MaterialCommunityIcons
        name="send-circle"
        style={{ marginStart: 10 }}
        color="#000"
        size={45}
        onPress={() => {
          if (text && onSend) {
            onSend({ text: text.trim(), user: user, _id: messageIdGenerator() }, true);
          }
        }}
      />
    );
  };

  const renderBubble = (props) => {
    return (
      <View>
        {renderName(props)}
        {renderAudio(props)}
        <Bubble {...props} />
      </View>
    );
  };

  const renderMessageVideo = (props) => {
    const { currentMessage } = props;
    return (
      <View style={{ padding: 20 }}>
        <Video
          resizeMode="contain"
          useNativeControls
          shouldPlay={false}
          source={{ uri: currentMessage.video }}
          style={styles.video}
        />
      </View>
    );
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      {isRecording ? (
        <View style={styles.recording}>
          <Text style={styles.StandardText}>{I18n.t('beingrecorded')}</Text>
        </View>
      ) : null}

      {showPreview ? (
        renderPreview(media)
      ) : (
        <GiftedChat
          alwaysShowSend
          renderUsernameOnMessage
          messages={messages}
          renderLoading={() => <ActivityIndicator style={{ marginTop: 20 }} animating color={"#fff"} size={"large"} />}
          showAvatarForEveryMessage
          renderMessageImage={renderMessageImage}
          renderMessageVideo={renderMessageVideo}
          renderInputToolbar={customtInputToolbar}
          renderSend={renderSend}
          onSend={(messages) => onSend(messages)}
          user={{ _id: user.uid, name: user.username, avatar: user.image }}
          onPressAvatar={(user) => {
            if (user != null) {
              navigation.navigate("FriendsFavorite", {
                screen: I18n.t('Atachment'),
                params: {
                  userId: user._id,
                  type: 2,
                },
              });
            }
          }}
          placeholder={I18n.t('Enteryoumessaghere')}
          renderActions={renderActions}
          renderBubble={renderBubble}
          shouldUpdateMessage={(props, nextProps) => props.extraData !== nextProps.extraData}
        />
      )}

      {type != "Private-Chat" && Platform.OS !== "ios" ? (
        <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={type == "Match-Chat" ? 160 : 80} />
      ) : null}

      <ImageView images={[{ uri: image }]} imageIndex={0} visible={visible} onRequestClose={() => setVisible(false)} />
    </LinearGradient>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  video: {
    height: height / 3,
    width: width / 1.5,
  },
  StandardText: {
    fontSize: 14,
    padding: 6,
    color: "white",
  },
  StandardContainer: {
    width: width / 1.5,
    backgroundColor: "transparent",
  },
  preview: {
    position: "absolute",
    zIndex: 555,
    height: height / 2,
    width: width / 1.2,
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    top: "20%",
    padding: 10,
  },
  videoPreview: {
    height: height / 3,
    width: width / 2,
  },
  imagePreview: {
    height: height / 3,
    width: width / 2,
    borderRadius: 10,
    resizeMode: "contain",
  },
  recording: {
    padding: 10,
    position: "absolute",
    top: 10,
    left: Dimensions.get("screen").width / 2.5,
    zIndex: 2,
    backgroundColor: "#02aab0",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});
