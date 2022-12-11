import React, { useRef, useState, useEffect } from "react";
import { displayMessage } from "../../../../util/extraMethods";
import { ScrollView } from "react-native-gesture-handler";
import { Video } from "expo-av";
import StarRating from "../../../../components/StarRating";
import { AirbnbRating } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar } from "react-native-elements";
import { FontAwesome5 } from "@expo/vector-icons";
import Fire from "../../../../Api/Fire";
import { View, Text, Image, TextInput, StyleSheet, Dimensions, Platform, ActivityIndicator } from "react-native";
import { ImageHeaderScrollView, TriggeringView } from "react-native-image-header-scroll-view";
import I18n from '../../../Translation/I18n';

const MIN_HEIGHT = Platform.OS === "ios" ? 90 : 55;
const MAX_HEIGHT = Dimensions.get("screen").height / 3;

const MatchRefereeMistakeViewer = ({ route, navigation }) => {
  const { itemData, clubId, matchId } = route.params;
  const navTitleView = useRef(null);
  const scrollView = useRef(null);
  const [loading, setloading] = useState(false);
  const [comment, setComment] = useState({ userId: "", userImage: "", userName: "", userMessage: "" });
  const [content, setContent] = useState({
    uid: "",
    imageVideo: "",
    title: "",
    type: "image/jpeg",
    comments: {},
    userId: "",
    userName: "",
    rating: 0,
    review: [],
  });

  //Get Content information
  useEffect(() => {
    let isMounted = true;
    //get Content information
    const subscriber = Fire.getRefereeMistakesContent(matchId, itemData, (content) => {
      if (isMounted && content != null) setContent(content);
    });

    //Get User's information
    if (isMounted) {
      (async () => {
        const user = await Fire.getUser(Fire.uid);
        setComment({ ...comment, userImage: user.image, userId: user.uid, userName: user.name });
      })();
    }

    // Stop listening for updates
    return () => {
      subscriber ? subscriber.off() : null;
      isMounted = false;
    };
  }, []);

  //Update rating
  const ratingCompleted = async (rating) => {
    //Check if user already rated or not
    if (content.reviews != null) {
      if (content.reviews.includes(content.userId)) {
        displayMessage(I18n.t('Youhavealreadyrated'));
        return;
      }
    }

    //Calculate ratings and reviews
    var ratings = content.reviews != null ? (content.rating + rating) / 2 : rating;
    var review = content.reviews != null ? [...content.reviews, content.userId] : [content.userId];

    await Fire.updateRefereeMistakesContent(matchId, itemData, { rating: ratings, reviews: review });
  };

  //Add Comment
  const addComment = async () => {
    setloading((loading) => true);
    await Fire.addCommentToRefereeMistakes(matchId, itemData, comment);
    setComment({ ...comment, userMessage: "" });
    scrollView.current.scrollTo({ x: 0, y: 0, Animated: true });
    setloading((loading) => false);
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      <FontAwesome5.Button
        name="arrow-left"
        style={{ alignSelf: "center", margin: 10 }}
        color="#fff"
        backgroundColor="transparent"
        size={25}
        onPress={() => navigation.goBack()}
      />

      <ImageHeaderScrollView
        maxHeight={MAX_HEIGHT}
        minHeight={MIN_HEIGHT}
        maxOverlayOpacity={0.6}
        minOverlayOpacity={0.0}
        renderTouchableFixedForeground={() =>
          content.type == "video/mp4" ? (
            <Video
              style={styles.video}
              rate={1.0}
              volume={1.0}
              isLooping={false}
              shouldPlay={true}
              useNativeControls={true}
              source={{ uri: content.imageVideo }}
              resizeMode="cover"
            />
          ) : (
            <Image source={{ uri: content.imageVideo }} style={styles.image} />
          )
        }
      >
        <LinearGradient colors={["#4e4376", "#4e4376"]}>
          <TriggeringView
            style={styles.section}
            onHide={() => navTitleView.current.fadeInUp(200)}
            onDisplay={() => navTitleView.current.fadeOut(100)}
          >
            <View style={styles.header}>
              <View style={styles.review}>
                {
                  <StarRating
                    color="#fff"
                    ratings={content.rating}
                    reviews={content.reviews != null ? content.reviews.length : 0}
                  />
                }
              </View>
              <View style={{ flex: 2 }}>
                <Text style={styles.title}>{content.userName}</Text>
                <Text style={styles.title}>{content.title}</Text>
              </View>
              <Avatar
                rounded={true}
                size={40}
                source={{ uri: content.userImage }}
                onPress={() =>
                  navigation.navigate("FriendsFavorite", {
                    screen: I18n.t('Atachment'), 
                    params:
                      content.userId != Fire.uid
                        ? { userId: content.userId, type: 2 }
                        : { userId: content.userId, type: 1 },
                  })
                }
              />
            </View>
          </TriggeringView>
          {content.userId != Fire.uid ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}> {I18n.t('ContentRating')}</Text>
              <AirbnbRating
                count={5}
                reviews={[I18n.t('Verybad'),I18n.t('Bad'),I18n.t('good'),I18n.t('verygood'),I18n.t('Excellent'),]}
                defaultRating={5}
                startingValue={content.ratings}
                onFinishRating={(rating) => ratingCompleted(rating)}
                size={20}
              />
            </View>
          ) : null}
          <View style={styles.comments}>
            <Text style={styles.sectionTitle}> {I18n.t('Comments')} </Text>
          </View>
          <ScrollView
            ref={(ref) => (scrollView.current = ref)}
            contentContainerStyle={{ alignItems: "center" }}
            style={[styles.sectionCom, styles.sectionLarge]}
          >
            {content.comments != null ? (
              Object.values(content.comments)
                .reverse()
                .map((com) => {
                  return (
                    <LinearGradient
                      colors={["rgba(255, 255, 255, .4)", "rgba(255, 255, 255, .4)"]}
                      style={styles.commentContainer}
                      key={com.uid}
                    >
                      <View style={styles.usernameContainer}>
                        <Text
                          style={{
                            paddingHorizontal: 10,
                            color: com.userName == comment.userName ? "#2b5876" : "#fff",
                          }}
                        >
                          {com.userName}
                        </Text>
                        <Avatar
                          rounded={true}
                          size={30}
                          source={{ uri: com.userImage }}
                          onPress={() =>
                            navigation.navigate("FriendsFavorite", {
                              screen: I18n.t('Atachment'),
                              params:
                                content.userId != Fire.uid
                                  ? { userId: content.userId, type: 2 }
                                  : { userId: content.userId, type: 1 },
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
                <Text style={styles.sectionContent}>{I18n.t('Therearenocomments')}</Text>
              </View>
            )}
          </ScrollView>
          <View style={styles.textInput}>
            <TextInput
              placeholder={I18n.t('Writeyourcomment')}
              placeholderTextColor="silver"
              style={styles.input}
              autoCapitalize="none"
              onChangeText={(text) => setComment({ ...comment, userMessage: text })}
              value={comment.userMessage}
              returnKeyType="done"
              onSubmitEditing={addComment}
            />
            {loading ? (
              <ActivityIndicator style={{ marginStart: 10 }} animating color="#fff" size="small" />
            ) : (
              <FontAwesome5
                name="paper-plane"
                style={{ marginStart: 10 }}
                color="#fff"
                size={25}
                onPress={addComment}
              />
            )}
          </View>
        </LinearGradient>
      </ImageHeaderScrollView>
    </LinearGradient>
  );
};

export default MatchRefereeMistakeViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: MAX_HEIGHT,
    width: Dimensions.get("window").width,
    alignSelf: "stretch",
    resizeMode: "cover",
  },
  title: {
    paddingHorizontal: 10,
    fontSize: 15,
    color: "#fff",
  },
  name: {
    fontWeight: "bold",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  sectionCom: {
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  sectionTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  sectionContent: {
    fontSize: 16,
    color: "#fff",
    textAlign: "justify",
  },
  titleContainer: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
  },
  imageTitle: {
    color: "white",
    backgroundColor: "transparent",
    fontSize: 24,
  },
  navTitleView: {
    height: MIN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 40 : 5,
    opacity: 0,
  },
  navTitle: {
    color: "white",
    fontSize: 18,
    backgroundColor: "transparent",
  },
  sectionLarge: {
    height: 250,
  },
  commentContainer: {
    padding: 10,
    borderRadius: 10,
    width: "80%",
    marginTop: 5,
    minHeight: 50,
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
  video: {
    height: "100%",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  review: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  comments: {
    alignItems: "center",
    paddingVertical: 5,
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
});
