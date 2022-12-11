import React, { useState, createRef, useEffect, useRef } from "react";
import { AirbnbRating, Avatar } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";
import VideoPlayer from "./VideoPlayer";
import { Video } from "expo-av";
import { ScrollView } from "react-native-gesture-handler";
import Info from "./Info";
import Sidebar from "./Sidebar";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import { FontAwesome5 } from "@expo/vector-icons";
import StarRating from "./StarRating";
import ModalSelector from "react-native-modal-selector";
import * as ImagePicker from "expo-image-picker";
import Fire from "../Api/Fire";
import firebase from "firebase/app";
import { displayMessage } from "../util/extraMethods";
import { SendGiftDialog } from "../components/SendGiftsDialog";
import Dialog, {
  DialogFooter,
  DialogButton,
  SlideAnimation,
  DialogContent,
  DialogTitle,
} from "react-native-popup-dialog";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Share,
  Image,
} from "react-native";
import I18n from '../screens/Translation/I18n';

const Container = styled.View`
  flex: 1;
`;

const Gradient = styled(LinearGradient)`
  height: 100%;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
`;

const Center = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: flex-end;
`;

const ChallengeView = ({ type, nav, challenge, user, points, otheruser }) => {
  const fall = new Animated.Value(1);
  const bsChat = createRef();
  const bsVote = createRef();
  const bsReport = createRef();
  const bsPicker = createRef();
  const bsAnswers = createRef();
  const scrollView = useRef(null);
  const [mute, setMute] = useState(false);
  const [paused, setPaused] = useState(true);
  const [reason, setReason] = useState("");
  const [dialogState, setDialogState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [rank, setRank] = useState({ key: 0, label: 0 });
  const [winner, setWinner] = useState({ id: "", name: "" });

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
      bsPicker.current.snapTo(1);
      await sendAnswer({
        type: result.type == "video" ? "video/mp4" : "image/jpeg",
        media: Platform.OS === "ios" ? result.uri.replace("file://", "") : result.uri,
      });
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
      bsPicker.current.snapTo(1);
      await sendAnswer({
        type: result.type == "video" ? "video/mp4" : "image/jpeg",
        media: Platform.OS === "ios" ? result.uri.replace("file://", "") : result.uri,
      });
    }
  };

  //Update rating
  const ratingCompleted = async (rating) => {
    //Check if user already rated or not
    if (challenge.reviews != null) {
      if (challenge.reviews.includes(user.uid)) {
        displayMessage(I18n.t('Youhavealreadyrated'));
        return;
      }
    }

    //Calculate ratings and reviews
    var ratings = challenge.reviews != null ? (challenge.rating + rating) / 2 : rating;
    var review = challenge.reviews != null ? [...challenge.reviews, user.uid] : [user.uid];

    await Fire.updateChallenge(challenge.uid, { rating: ratings, reviews: review });
  };

  //Report a challenge
  const sendReport = async () => {
    //Check if user already reported or not
    if (challenge.reports != null) {
      if (challenge.reports.some((report) => report.user === user.uid)) {
        displayMessage(I18n.t('Ihavereachedbefore'));
        return;
      }
    }

    var reports =
      challenge.reports != null
        ? [...challenge.reports, { user: user.uid, reason: reason }]
        : [{ user: user.uid, reason: reason }];

    const res = await Fire.updateChallenge(challenge.uid, { reports: reports });
    if (!res) return displayMessage(I18n.t('Errors'));
    setReason("");
  };

  // Register user answer
  const sendAnswer = async (media = null) => {
    if (answer.trim().length == 0 && media === null) return;

    if (
      challenge.usersAnswered ? Object.values(challenge.usersAnswered).some((ans) => ans.userId === user.uid) : false
    ) {
      displayMessage(I18n.t('sharedbefore'));
      return;
    }

    Alert.alert(
      I18n.t('alert'),
      `${I18n.t('Toparticipatedrawn')} ${points} ${I18n.t('silverballs')}`,
      [
        { text: I18n.t('cancel'), style: "cancel" },
        {
          text: I18n.t('okay'),
          onPress: async () => {
            if (user.silverBalls < points) return displayMessage(I18n.t('Youdonhaveenoughballs'));


            setLoading((loading) => true);

            const res = await Fire.addAnswerToTalentChallenge(challenge.uid, {
              userId: user.uid,
              userImage: user.image,
              userName: user.username,
              userAnswer: answer,
              userMedia: media,
            });

            if (!res) {
                            displayMessage(I18n.t('Errors'));

              setLoading((loading) => false);
              return;
            }

            const res2 = await Fire.updateChallenge(challenge.uid, { balls: challenge.balls + points });

            if (!res2) {
                            displayMessage(I18n.t('Errors'));

              setLoading((loading) => false);
              return;
            }

            const finalResult = await Fire.updateUser(user.uid, {
              silverBalls: firebase.firestore.FieldValue.increment(-points),
            });

            if (!finalResult) {
                            displayMessage(I18n.t('Errors'));

              setLoading((loading) => false);
              return;
            }

            setAnswer("");
            setLoading((loading) => false);
          },
        },
      ],
      { cancelable: false }
    );
  };

  //Add Comment
  const addComment = async () => {
    if (comment.trim().length == 0) return;

    setLoading((loading) => true);
    await Fire.addCommentToTalentChallenge(challenge.uid, {
      userId: user.uid,
      userImage: user.image,
      userName: user.username,
      userMessage: comment,
    });
    setComment("");
    scrollView.current.scrollTo({ x: 0, y: 0, Animated: true });
    setLoading((loading) => false);
  };

  //Send Prize
  const sendPrize = async (user) => {
    if (challenge.prizes) {
      //check if that prize has already been given to a user
      if (challenge.prizes[rank.key].user != "") {
        displayMessage(I18n.t('Thegiftuser'));
        return;
      }

      //check if that user has already been given a gift
      if (challenge.prizes.some((prize) => prize.user == user.name)) {
        displayMessage(I18n.t('Yougiventhiusergiftbefor'));
        return;
      }

      let prizes = challenge.prizes;
      prizes[rank.key].user = user.name;

      const res = await Fire.updateUser(user.id, {
        silverBalls: firebase.firestore.FieldValue.increment(prizes[rank.key].prize),
      });

      if (!res) return displayMessage(I18n.t('Errors'));

      const result = await Fire.updateChallenge(challenge.uid, { prizes: prizes });

      if (result) {
        displayMessage(I18n.t('Theifthasbeensent'));
        setVisible(false);
      } else {
        displayMessage(I18n.t('Errors'));
      }
    }
  };

  //talent options dialog footer
  const renderFooter = () => {
    return (
      <DialogFooter>
        <DialogButton
          align="center"
          textStyle={{ color: "white" }}
          text={challenge.user ? (challenge.user.uid == Fire.uid ? I18n.t('Done') : I18n.t('Cancel')) : I18n.t('Cancel')}
          onPress={() =>
            challenge.user
              ? challenge.user.uid == Fire.uid
                ? sendPrize(winner)
                : setVisible(false)
              : setVisible(false)
          }
        />
      </DialogFooter>
    );
  };

  //talent options dialog
  const renderDialog = () => (
    <Dialog
      visible={visible}
      onTouchOutside={() => setVisible(false)}
      dialogStyle={{ backgroundColor: "#02aab0", width: "80%" }}
      dialogTitle={
        <DialogTitle
          style={{ backgroundColor: "#02aab0" }}
          align="center"
          title={challenge.user ? (challenge.user.uid == Fire.uid ? I18n.t('gifts') : I18n.t('Choosegifts')) : I18n.t('gifts') }

        />
      }
      dialogAnimation={new SlideAnimation({ slideFrom: "bottom" })}
      footer={renderFooter()}
    >
      <DialogContent style={styles.dialogContent}>
        {challenge.user ? (
          challenge.user.uid == Fire.uid ? (
            <View style={styles.action}>
              <ModalSelector
                initValueTextStyle={{ color: "#000" }}
                style={{ height: 30, width: "100%" }}
                data={
                  challenge.prizes
                    ? challenge.prizes.map((prize, index) => {
                        return { key: index, label: prize.prize };
                      })
                    : []
                }
                initValue={I18n.t('Chooserank')}
                onChange={(option) => setRank(option)}
                cancelText={I18n.t('cancel')}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.data}>{rank.label}</Text>
                </View>
              </ModalSelector>
            </View>
          ) : (
            <ScrollView>
              {challenge.prizes ? (
                challenge.prizes.map((prize, index) => {
                  return (
                    <View key={index} style={styles.prizeContainer}>
                      <Text style={styles.prizeText}>{index + 1}</Text>

                      <Text style={styles.prizeText}>
                        {prize.user != ""
                          ? prize.user.length > 15
                            ? prize.user.substr(0, 20) + "..."
                            : prize.user
                            : I18n.t('Therewinner')}
                            </Text>
                      <Text style={styles.prizeText}>{prize.prize}</Text>
                    </View>
                  );
                })
              ) : (
                <View style={{ padding: 10 }}>
                  <Text style={styles.emptyText}>{I18n.t('Nogifts')}</Text>
                </View>
              )}
            </ScrollView>
          )
        ) : null}
      </DialogContent>
    </Dialog>
  );

  const renderInnerPicker = () => (
    <ScrollView contentContainerStyle={styles.panel}>
      <View style={{ alignItems: "center" }}>
      <Text style={[styles.panelTitle, { color: "#fff", marginVertical: 10 }]}>{I18n.t('uploadphoto')}</Text>
      </View>
      <TouchableOpacity style={styles.panelButton} onPress={takePhotoFromCamera}>
      <Text style={styles.panelButtonTitle}>{I18n.t('Takeapictureorclip')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton} onPress={choosePhotoFromLibrary}>
      <Text style={styles.panelButtonTitle}>{I18n.t('Choosefromthestudio')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton} onPress={() => bsPicker.current.snapTo(1)}>
      <Text style={styles.panelButtonTitle}>{I18n.t('cancel')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderInnerChat = () => (
    <View style={styles.panel}>
      <Text style={styles.comments}>{I18n.t('Comments')}</Text>
      <ScrollView
        ref={(ref) => (scrollView.current = ref)}
        contentContainerStyle={{ alignItems: "center" }}
        style={styles.sectionCom}
      >
        {challenge.comments != null ? (
          Object.values(challenge.comments)
            .reverse()
            .map((com) => {
              return (
                <LinearGradient
                  colors={["rgba(255, 255, 255, .4)", "rgba(255, 255, 255, .4)"]}
                  style={[styles.commentContainer, { width: "100%" }]}
                  key={com.uid}
                >
                  <View style={styles.usernameContainer}>
                    <Text
                      style={{
                        paddingHorizontal: 10,
                        color: com.userId == challenge.user.uid ? "gold" : com.uid == Fire.uid ? "#2b5876" : "#fff",
                      }}
                    >
                      {com.userName}
                    </Text>
                    <Avatar
                      rounded={true}
                      size={30}
                      source={{ uri: com.userImage }}
                      onPress={() =>
                        nav.navigate("FriendsFavorite", {
                             screen: I18n.t('Atachment'),

                          params: { userId: challenge.user.uid, type: challenge.user.uid != Fire.uid ? 2 : 1 },
                        })
                      }
                    />
                  </View>
                  <Text style={styles.message}>{com.userMessage}</Text>
                </LinearGradient>
              );
            })
        ) : (
          <View style={{ padding: 10 }}>
            <Text style={styles.emptyText}>{I18n.t('Therearenocomments')}</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.textInput}>
        <TextInput
          placeholder={I18n.t('Writeyourcomment')}
          placeholderTextColor="silver"
          style={styles.input}
          autoCapitalize="none"
          onChangeText={(text) => setComment(text)}
          value={comment}
          returnKeyType="done"
          onSubmitEditing={addComment}
        />
        {loading ? (
          <ActivityIndicator style={{ marginStart: 10 }} animating color="#fff" size="small" />
        ) : (
          <FontAwesome5 name="paper-plane" style={{ marginStart: 10 }} color="#fff" size={25} onPress={addComment} />
        )}
      </View>
    </View>
  );

  const renderInnerReport = () => (
    <View style={styles.panel}>
      <Text style={styles.panelButtonTitle}>{I18n.t('Reportthechallenge')}</Text>
      <TextInput
        placeholder={I18n.t('Pleasewritereport')}
        placeholderTextColor="silver"
        style={styles.report}
        numberOfLines={4}
        value={reason}
        onChangeText={(text) => setReason(text)}
        autoCapitalize="none"
      />
      <View style={styles.button}>
        <TouchableOpacity onPress={sendReport}>
          <LinearGradient
            colors={["#02aab0", "#00cdac"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.signIn}
          >
            <Text style={styles.buttonText}>{I18n.t('Report')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderInnerVote = () => (
    <View style={styles.panel}>
      {challenge.user ? (
        challenge.user.uid != Fire.uid ? (
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text style={styles.panelButtonTitle}> {I18n.t('ChallengeRate')} </Text>
            <AirbnbRating
              count={5}
              reviews={[I18n.t('Verybad'),I18n.t('Bad'),I18n.t('good'),I18n.t('verygood'),I18n.t('Excellent'),]}
              defaultRating={1}
              onFinishRating={(rating) => ratingCompleted(rating)}
              size={30}
            />
          </View>
        ) : null
      ) : null}
      <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
        <Text style={styles.panelButtonTitle}> {I18n.t('AudienceRating')} </Text>
        <StarRating
          color="#fff"
          big={true}
          ratings={challenge.rating || 0}
          reviews={challenge.reviews ? challenge.reviews.length : 0}
        />
      </View>
    </View>
  );

  const renderInnerAnswers = () => (
    <View style={styles.panel}>
      <Text style={styles.comments}>{I18n.t('Postlogs')}</Text>
      <ScrollView
        ref={(ref) => (scrollView.current = ref)}
        contentContainerStyle={{ alignItems: "center" }}
        style={styles.sectionCom}
      >
        {challenge.usersAnswered != null ? (
          Object.values(challenge.usersAnswered).map((com) => {
            const isGifted = challenge.prizes.some((prize) => prize.user == com.userName);

            return (
              <View style={{ flexDirection: "row" }} key={com.uid}>
                <LinearGradient
                  colors={["rgba(255, 255, 255, .4)", "rgba(255, 255, 255, .4)"]}
                  style={styles.commentContainer}
                >
                  <View style={styles.usernameContainer}>
                    <Text
                      style={{
                        paddingHorizontal: 10,
                        color: com.userId == challenge.user.uid ? "gold" : com.uid == Fire.uid ? "#2b5876" : "#fff",
                      }}
                    >
                      {com.userName}
                    </Text>
                    <Avatar
                      rounded={true}
                      size={30}
                      source={{ uri: com.userImage }}
                      // onPress={() =>
                      //   nav.navigate("FriendsFavorite", {
                      //                               screen: I18n.t('Atachment'),

                      //     params: { userId: challenge.user.uid, type: challenge.user.uid != Fire.uid ? 2 : 1 },
                      //   })
                      // }
                    />
                    <FontAwesome5 style={styles.giftIcon} name="gift" color={isGifted ? "gold" : "#fff"} size={20} />
                  </View>
                  <View style={styles.message}>
                    {com.userMedia ? (
                      com.userMedia.type == "video/mp4" ? (
                        <Video
                          style={styles.video}
                          rate={1.0}
                          volume={1.0}
                          isLooping={false}
                          useNativeControls={true}
                          source={{ uri: com.userMedia.media }}
                          resizeMode="cover"
                          ignoreSilentSwitch={'ignore'}

                        />
                      ) : (
                        <Image height={200} width={200} style={styles.image} source={{ uri: com.userMedia.media }} />
                      )
                    ) : (
                      <Text style={styles.message}>{com.userAnswer}</Text>
                    )}
                  </View>
                </LinearGradient>
                {challenge.user.uid === Fire.uid ? (
                  <FontAwesome5
                    style={styles.giftIcon}
                    name="gift"
                    color={isGifted ? "gold" : "#fff"}
                    size={25}
                    onPress={() => {
                      setVisible(true);
                      setWinner({ id: com.userId, name: com.userName });
                    }}
                  />
                ) : null}
              </View>
            );
          })
        ) : (
          <View style={{ padding: 10 }}>
            <Text style={styles.emptyText}>{I18n.t('Thereisnoposts')}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  //Share Challenge to social media
  // const shareChallenge = async () => {
  //   try {
  //     const result = await Share.share({ title: challenge.title, message: I18n.t('Downloadchallenge') });
  //     if (result.action === Share.dismissedAction) alert(I18n.t('Notpublished'));
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };
  const shareChallenge = async () => {
    try {
      const result = await Share.share({ title: challenge.title, message: `${I18n.t('Downloadchallengee')} : (${challenge.title})
     ${I18n.t('Downloadchallenge')}
     https://www.challenge2021.com/download-
      `
   
    
    });
      if (result.action === Share.dismissedAction) alert(I18n.t('Notpublished'));
    } catch (error) {
      alert(error.message);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHandle} />
      <FontAwesome5
        style={styles.panelIcon}
        name="times"
        color="#fff"
        size={20}
        onPress={() => {
          bsChat.current.snapTo(1);
          bsVote.current.snapTo(1);
          bsReport.current.snapTo(1);
          bsAnswers.current.snapTo(1);
          bsPicker.current.snapTo(1);
        }}
      />
    </View>
  );

  const renderBottomSheet = (bs, inner) => (
    <BottomSheet
      ref={bs}
      snapPoints={[430, 0]}
      renderContent={inner}
      renderHeader={renderHeader}
      initialSnap={1}
      callbackNode={fall}
      enabledContentTapInteraction={false}
      enabledGestureInteraction={true}
    />
  );

  return (
    <Container>
      {renderBottomSheet(bsChat, renderInnerChat)}
      {renderBottomSheet(bsVote, renderInnerVote)}
      {renderBottomSheet(bsReport, renderInnerReport)}
      {renderBottomSheet(bsAnswers, renderInnerAnswers)}
      {renderBottomSheet(bsPicker, renderInnerPicker)}
      {renderDialog()}
      <Animated.View style={{ opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)) }}>
        <VideoPlayer
          isPause={paused}
          isMute={mute}
          video={challenge.video}
          music={challenge.music}
          poster={challenge.thumbnail}
        />
        <Gradient
          locations={[0, 0.26, 0.6, 1]}
          colors={["rgba(26,26,26,0.6)", "rgba(26,26,26,0)", "rgba(26,26,26,0)", "rgba(26,26,26,0.6)"]}
        >
          <Center>
            <FontAwesome5
              name={paused ? "pause" : "play"}
              style={styles.pauseIcon}
              color="gray"
              size={20}
              onPress={() => setPaused(!paused)}
            />
            <Info user={challenge.user || {}} title={challenge.title} music={challenge.music || {}} />
            <Sidebar
              onPressNavigate={() =>
                nav.navigate("FriendsFavorite", {
                                            screen: I18n.t('Atachment'),

                  params: { userId: challenge.user.uid, type: challenge.user.uid != Fire.uid ? 2 : 1 },
                })
              }
              type={type}
              sameUser={challenge.user ? challenge.user.uid === Fire.uid : false}
              onPressGift={() => setDialogState(true)}
              onPressMute={() => setMute(!mute)}
              onPressReport={() => bsReport.current.snapTo(0)}
              onPressVote={() => bsVote.current.snapTo(0)}
              onPressChat={() => bsChat.current.snapTo(0)}
              onPressAnswer={() => bsAnswers.current.snapTo(0)}
              onPressShare={shareChallenge}
              avatar={challenge.user ? challenge.user.image : ""}
              count={{
                reviews: challenge.reviews ? challenge.reviews.length : 0,
                comment: Object.keys(challenge.comments || {}).length,
                flags: challenge.reports ? challenge.reports.length : 0,
                answers: Object.keys(challenge.usersAnswered || {}).length,
              }}
            />
          </Center>
          {type == 1 && (challenge.user ? challenge.user.uid != Fire.uid : false) && !challenge.isClosed ? (
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", padding: 15 }}>
              <View style={styles.answerContainer}>
                <FontAwesome5 name="image" color="#fff" size={25} onPress={() => bsPicker.current.snapTo(0)} />
                <TextInput
                  placeholder={ I18n.t('theanswer')}
                  placeholderTextColor="silver"
                  style={styles.answer}
                  value={answer}
                  onChangeText={(text) => setAnswer(text)}
                  autoCapitalize="none"
                />
              </View>

             
               <FontAwesome5
                  name="paper-plane"
                  style={{ marginStart: 10 }}
                  color="#fff"
                  size={25}
                  onPress={() => sendAnswer(null)}
                />

              {loading ? (
                <ActivityIndicator style={{ marginStart: 10 }} animating color="#fff" size="small" />
              ) : (
                <FontAwesome5
                name="gifts"
                style={{ marginStart: 10 }}
                color="#fff"
                size={25}
                onPress={() => setVisible(true)}
              />
               
              )}
            </View>
          ) : null}
          <SendGiftDialog otheruser={otheruser} visible={dialogState} onPressOutside={() => setDialogState(false)} />
        </Gradient>
      </Animated.View>
      <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={80} />
    </Container>
  );
};

export default ChallengeView;

const styles = StyleSheet.create({
  panel: {
    alignItems: "center",
    height: "100%",
    padding: 20,
    backgroundColor: "#4e4376",
  },
  header: {
    backgroundColor: "#4e4376",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  panelHandle: {
    width: 40,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#fff",
    alignSelf: "center",
  },
  panelIcon: {
    paddingHorizontal: 10,
    marginBottom: 5,
    alignSelf: "flex-end",
  },
  giftIcon: {
    paddingHorizontal: 10,
    marginBottom: 5,
    alignSelf: "center",
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
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
    margin: 5,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  button: {
    alignItems: "center",
    marginVertical: 10,
  },
  signIn: {
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 5,
    paddingHorizontal: 20,
  },
  report: {
    marginTop: 20,
    backgroundColor: "transparent",
    color: "#fff",
    borderWidth: 1,
    padding: 10,
    borderColor: "#fff",
    borderRadius: 10,
  },
  answerContainer: {
    flexDirection: "row",
    borderWidth: 1,
    height: 40,
    flex: 1,
    borderColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  answer: {
    backgroundColor: "transparent",
    color: "#fff",
    padding: 10,
    flex: 1,
    textAlign:'center'
  },
  giftBalls: {
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    alignSelf: "center",
  },
  giftTitle: {
    color: "gold",
    fontSize: 15,
    alignSelf: "center",
    marginVertical: 10,
  },
  emptyText: {
    color: "#fff",
    fontSize: 30,
    
  },
  prizeText: {
    color: "#fff",
    fontSize: 20,
    textAlign:'center',
    
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionCom: {
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    width: "100%",
    flex: 1,
  },
  commentContainer: {
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginTop: 5,
    minHeight: 50,
    alignItems: "flex-end",
  },
  usernameContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  message: {
    paddingRight: 40,
    color: "#fff",
  },
  textInput: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  comments: {
    fontSize: 12,
    color: "gold",
    padding: 5,
  },
  input: {
    backgroundColor: "transparent",
    color: "#fff",
    borderWidth: 1,
    padding: 10,
    height: 40,
    borderColor: "#fff",
    borderRadius: 10,
    flex: 1,
  },
  pauseIcon: {
    position: "absolute",
    alignSelf: "center",
    left: Dimensions.get("screen").width / 2.1,
    zIndex: 1,
  },
  dialogContent: {
    backgroundColor: "#02aab0",
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 400,
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
  prizeContainer: {
    width: Dimensions.get("screen").width / 1.5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 10,
    resizeMode:"contain",
  },
  video: {
    height: 200,
    width: 200,
    borderRadius: 10,
  },
});
