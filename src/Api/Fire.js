import "firebase/firestore";
import "firebase/database";
import firebase from "firebase";
import { displayMessage, sendPushNotification, getTimeLeft } from "../util/extraMethods";
import { v4 as uuidv4 } from "uuid";
import { Alert } from "react-native";
import moment from "moment";
import I18n from '../screens/Translation/I18n';


class Fire {
  constructor() {
    this.init();
  }

  // Initialize Firebase
  init = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyD-qc7bSDT2D_n6Vfev8XAjnLZqXb6hr5E",
        authDomain: "challenge-38ce2.firebaseapp.com",
        databaseURL: "https://challenge-38ce2.firebaseio.com",
        projectId: "challenge-38ce2",
        storageBucket: "challenge-38ce2.appspot.com",
        messagingSenderId: "1017832191003",
        appId: "1:1017832191003:web:4420d46dd13fbe4d89f4be",
        measurementId: "G-BKY98F4JQS",
      });
    }
  };

  /* ===========================
    Chat Api
  ============================*/
  sendMessage = async (type, id, message, userId) => {
    if (type == 1) {
      const newReference = firebase.database().ref(`clubChat/${id}/`).push();
      await newReference.set(message);
    } else if (type == 2) {
      const newReference = firebase.database().ref(`matchesChat/${id}/`).push();
      await newReference.set(message);
    } else {
      const newReference = firebase.database().ref(`privateChat/${id}/`).push();
      await newReference.set(message);
      const documentSnapshot = await this.users_db.doc(userId).get();

      const res = await this.updateUser(userId, {
        ["chatRooms." + this.uid]: {
          roomId: id,
          unseen: documentSnapshot.data()[`chatRooms`][this.uid].unseen + 1,
          userId: documentSnapshot.data()[`chatRooms`][this.uid].userId,
          userImage: documentSnapshot.data()[`chatRooms`][this.uid].userImage,
          userName: documentSnapshot.data()[`chatRooms`][this.uid].userName,
        },
      });

      if (res) {
        sendPushNotification(
          documentSnapshot.data().token,
          `${I18n.t('messagefrom')} ${message.user.name || I18n.t('Anonymous')} `,
          !message.messageType ? message.text : message.messageType,
          ""
        );
      }
    }
  };

  getClubChat = (clubId, callback) => {
    const ref = firebase.database().ref(`clubChat/${clubId}`);

    ref.limitToLast(100).on("value", (snapshot) => {
      let messages = [];
      snapshot.forEach((message) => {
        const FormatedMessage = {
          _id: message.val()._id,
          text: message.val().text,
          image: message.val().image,
          video: message.val().video,
          voice: message.val().voice,
          messageType: message.val().messageType,
          seen: message.val().seen,
          createdAt: new Date(message.val().createdAt),
          user: {
            _id: message.val().user._id,
            name: message.val().user.name,
            avatar: message.val().user.avatar,
          },
        };
        messages.push(FormatedMessage);
      });
      callback(messages.sort((a, b) => b.createdAt - a.createdAt));
    });

    return ref;
  };

  getMatchChat = (matchID, callback) => {
    const ref = firebase.database().ref(`matchesChat/${matchID}`);

    ref.limitToLast(100).on("value", (snapshot) => {
      let messages = [];
      snapshot.forEach((message) => {
        const FormatedMessage = {
          _id: message.val()._id,
          text: message.val().text,
          image: message.val().image,
          video: message.val().video,
          voice: message.val().voice,
          messageType: message.val().messageType,
          seen: message.val().seen,
          createdAt: new Date(message.val().createdAt),
          user: {
            _id: message.val().user._id,
            name: message.val().user.name,
            avatar: message.val().user.avatar,
          },
        };
        messages.push(FormatedMessage);
      });
      callback(messages.sort((a, b) => b.createdAt - a.createdAt));
    });

    return ref;
  };

  getPrivateChat = (roomId, callback) => {
    const ref = firebase.database().ref(`privateChat/${roomId}`);

    ref.limitToLast(50).on("value", (snapshot) => {
      let messages = [];
      snapshot.forEach((message) => {
        const FormatedMessage = {
          _id: message.val()._id,
          text: message.val().text,
          image: message.val().image,
          video: message.val().video,
          voice: message.val().voice,
          messageType: message.val().messageType,
          seen: message.val().seen,
          createdAt: new Date(message.val().createdAt),
          user: {
            _id: message.val().user._id,
            name: message.val().user.name,
            avatar: message.val().user.avatar,
          },
        };
        messages.push(FormatedMessage);
      });
      callback(messages.sort((a, b) => b.createdAt - a.createdAt));
    });

    return ref;
  };

  getUserChatRooms = async () => {
    try {
      const user = await this.getUser(this.uid);
      let rooms = [];

      if (!user.chatRooms) return [];

      Object.entries(user.chatRooms).forEach((room) => {
        rooms.push({
          userId: room[1].userId,
          userImage: room[1].userImage,
          userName: room[1].userName,
          roomId: room[1].roomId,
          unseen: room[1].unseen,
        });
      });
      return rooms;
    } catch (error) {
      displayMessage(error.message);
      return [];
    }
  };

  /* ===========================
    Auth Api
  ============================*/
  signInWithEmail = async (email, password, navigation) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);

      //Check if user's email is verified or not
      if (firebase.auth().currentUser.emailVerified) {
        const user = await this.getUser(this.uid);

        if (user) {
          //Go to Main Screen
          user.type == "Admin"
            ? navigation.reset({ index: 0, routes: [{ name: "Admin" }] })
            : navigation.reset({ index: 0, routes: [{ name: "DrawerContent" }] });
        } else {
          alert("لا يوجد اي حساب مطابق للمعلومات المدخلة");
        }

        return false;
      } else {
        alert("البريد الإلكتروني غير موثق الرجاء التحقق من البريد والتأكيد لكي تستطيع استخدام حسابك");
        return false;
      }
    } catch (error) {
      Alert.alert("خطا!", error.message, [{ text: "حسناً" }]);
      return false;
    }
  };


  signInWithPhone = async (phone, password, navigation) => {
    //Check if there is a user with this phone number and password
    try {
      const querySnapshot = await this.users_db.where("phoneNumber", "==", phone).get();

      if (querySnapshot.empty) {
        Alert.alert(I18n.t('Error'), I18n.t('Therenouserwithnumber') ,[{ text: I18n.t('okay') }]);
        return false;
      }

      querySnapshot.forEach((documentSnapshot) => {
        if (documentSnapshot.data().password == password) {
          this.signInWithEmail(documentSnapshot.data().email, password, navigation);
        } else {
          //Hide loading icon
          Alert.alert(I18n.t('Error'), I18n.t('passworddoesnotmatch') ,[{ text: I18n.t('okay') }]);
          return false;
        }
      });
    } catch (error) {
      // Display the error
      Alert.alert(I18n.t('Error'), error.message, [{ text: I18n.t('okay') }]);
      return false;
    }
  };

  signUpWithEmail = async (email, password, user) => {
    try {
      const userCreds = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const snapshot = await this.getAllBalls("Bronze");

      //Get Registeration Balls
      user.silverBalls = parseInt(snapshot.newAccount);

      //Insert user object to firestore database
      user.uid = userCreds.user.uid;

      await this.users_db.doc(userCreds.user.uid).set(user);

      //Update Club Users
      await this.updateClubUsers(user.favLocalTeam, userCreds.user.uid);
      await this.updateClubUsers(user.FavInterTeam, userCreds.user.uid);

      //Send Verification Email
      await firebase.auth().currentUser.sendEmailVerification();
      alert(I18n.t('Registrationhasbeensuccessful'));
      return true;
    } catch (error) {
      // Handle Errors here.
      const { code, message } = error;

      if (code == "auth/weak-password") {
        Alert.alert(I18n.t('Error'),I18n.t('weakpassword'), [{ text:I18n.t('okay')  }]);
      } else if (code == "auth/email-already-in-use") {
        Alert.alert(I18n.t('Error'),I18n.t('Thereisanemail'),[{ text: I18n.t('okay') }]);
      } else {
        Alert.alert(I18n.t('Error'), message, [{ text: I18n.t('okay') }]);
      }
      return false;
    }
  };

  resetPassword = async (email) => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      Alert.alert( I18n.t('Done'),I18n.t('Pleasecheckemail'),[{ text: I18n.t('okay')}]);
      return true;
    } catch (error) {
      Alert.alert(I18n.t('Error'), error.message, [{ text: I18n.t('okay') }]);
      return false;
    }
  };

  signOut = async (navigation) => {
    try {
      await firebase.auth().signOut();
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (e) {
      alert(e.message);
    }
  };

  updateUser = async (id, data) => {
    try {
      await this.users_db.doc(id).update(data);
      return true;
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  getUser = async (id) => {
    try {
      const documentSnapshot = await this.users_db.doc(id).get();
      return documentSnapshot.data();
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  observeUser = (id, callback) => {
    return this.users_db.doc(id).onSnapshot((documentSnapshot) => {
      callback(documentSnapshot.data());
    });
  };

  getAppLinks = async () => {
    try {
      const snapshot = await firebase.database().ref("links").once("value");
      return snapshot.val();
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  searchUser = async (username) => {
    try {
      if (firebase.auth().currentUser.username === username) {
        Alert.alert(I18n.t('Error'),I18n.t('Yocanendayourself'), [{ text:I18n.t('okay') }]);
        return null;
      }

      const querySnapshot = await this.users_db.where("username", "==", username).get();

      if (querySnapshot.empty) {
        Alert.alert(I18n.t('Error'),I18n.t('Thereisnouserwiththisemail'), [{ text:I18n.t('okay') }]);
        return null;
      }

      let user = null;
      querySnapshot.forEach((documentSnapshot) => {
        if (documentSnapshot.data().friends.includes(this.uid)) {
          Alert.alert(I18n.t('Error'),I18n.t('Theuserfriendsist'), [{ text:I18n.t('okay') }]);
          return null;
        }
        user = documentSnapshot.data();
      });
      return user;
    } catch (error) {
      displayMessage(error.message);
      return null;
    }
  };
  /* ===========================
    Club Api
  ============================*/
  addClub = async (club) => {
    try {
      await firebase
        .database()
        .ref(`clubs/${club.team_key}`)
        .set({
          uid: `${club.team_key}`,
          name: `${club.team_name}`,
          image: `${club.team_image}`,
          rating: 0,
          reviews: [],
          users: [this.uid],
          goalsOnTeam: 0,
          goalsForTeam: 0,
        });
    } catch (e) {
      displayMessage(e.message);
    }
  };

  getAllClubs = (callback) => {
    const ref = firebase.database().ref(`clubs`);
    ref.on("value", (snapshot) => {
      let clubs = [];
      snapshot.forEach((club) => {
        clubs.push(club.val());
      });
      callback(clubs);
    });
    return ref;
  };

  getAllClubsDropList = async () => {
    try {
      const snapshot = await firebase.database().ref(`clubs`).once("value");
      let clubs = [];
      snapshot.forEach((club) => {
        clubs.push({ key: club.val().uid, label: club.val().name });
      });
      return clubs;
    } catch (error) {
      displayMessage(error.message);
    }
  };

  updateClubUsers = async (id, user) => {
    try {
      const snapshot = await firebase.database().ref(`clubs/${id}`).once("value");

      if (snapshot.val().users.includes(user)) return true;

      await snapshot.ref.update({
        users: snapshot.val().users != null ? [...snapshot.val().users, user] : [user],
      });
      return true;
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  getClub = (club, callback) => {
    const ref = firebase.database().ref(`clubs/${club.team_key}`);

    ref.on("value", (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        this.addClub(club);
        callback(null);
      }
    });

    return ref;
  };

  getClubUsers = (id, callback) => {
    const ref = firebase.database().ref(`clubs/${id}/users/`);

    ref.on("value", (snapshot) => {
      let users = [];
      snapshot.forEach((user) => {
        users.push(user.val());
      });
      callback(users);
    });

    return ref;
  };

  updateClub = async (clubId, data, message = I18n.t('Editedsuccessfully')) => {
    try {
      await firebase.database().ref(`clubs/${clubId}`).update(data);
      displayMessage(message);
    } catch (error) {
      displayMessage(error.message);
    }
  };

  deleteClub = async (id, callback) => {
    try {
      await firebase.database().ref(`clubs/${id}`).remove();
      callback(true);
    } catch (error) {
      callback(error.message);
    }
  };

  getAllStudioContents = (clubId, callback) => {
    const ref = firebase.database().ref(`studio/${clubId}`);

    ref.limitToLast(50).on("value", (snapshot) => {
      let contents = [];
      snapshot.forEach((content) => {
        contents.push(content.val());
      });
      callback(contents);
    });

    return ref;
  };

  addPlayer = async (clubId, player) => {
    try {
      await firebase
        .database()
        .ref(`players/${clubId}/${player.player_key}`)
        .set({
          uid: `${player.player_key}`,
          type: `${player.player_type}`,
          name: `${player.player_name}`,
          rating: 0,
          reviews: [],
        });
    } catch (error) {
      displayMessage(error.message);
    }
  };

  updatePlayer = async (clubId, id, data) => {
    try {
      await firebase.database().ref(`players/${clubId}/${id}`).update(data);
      displayMessage(I18n.t('Successfullyevaluated')); 
    } catch (error) {
      displayMessage(error.message);
    }
  };

  deletePlayer = async (clubId, playerId) => {
    try {
      await firebase.database().ref(`players/${clubId}/${playerId}`).remove();
      displayMessage(I18n.t('Deletedsuccessfully'));
    } catch (error) {
      displayMessage(error.message);
    }
  };

  getAllPlayers = async (clubId) => {
    const snapshot = await firebase.database().ref(`players/${clubId}`).once("value");
    let players = [];
    snapshot.forEach((player) => {
      players.push(player.val());
    });
    return players;
  };

  getPlayer = async (clubId, player) => {
    try {
      const snapshot = await firebase.database().ref(`players/${clubId}/${player.player_key}`).once("value");
      if (snapshot.exists()) return snapshot.val();
      this.addPlayer(clubId, player);
    } catch (error) {
      displayMessage(error.message);
    }
  };

  /* ===========================
    Tickets Api
  ============================*/
  getAllTickets = (callback) => {
    const ref = firebase.database().ref(`IssueTickets`);

    ref.on("value", (snapshot) => {
      let tickets = [];
      snapshot.forEach((ticket) => {
        tickets.push(ticket.val());
      });
      callback(tickets.filter((ticket) => !ticket.solved));
    });

    return ref;
  };

  updateTicket = async (ticketId) => {
    try {
      await firebase.database().ref(`IssueTickets/${ticketId}`).update({ solved: true });
      displayMessage(I18n.t('Updated'));
    } catch (error) {
      displayMessage(error.message);
    }
  };

  addTicket = async (data) => {
    try {
      const newReference = firebase.database().ref(`IssueTickets`).push();
      data.uid = newReference.key;
      await newReference.set(data);
      displayMessage(I18n.t('Senttotechsupportou'));
    } catch (error) {
      displayMessage(error.message);
    }
  };

  /* ===========================
    Balls Api
  ============================*/
  getAllBalls = async (type) => {
    try {
      const snapshot = await firebase.database().ref(`BallsPoints/${type}`).once("value");
      return snapshot.val();
    } catch (error) {
      displayMessage(error.message);
    }
  };

  updateBalls = async (type, data) => {
    try {
      await firebase.database().ref(`BallsPoints/${type}`).update(data);
      return true;
    } catch (error) {
      return error.message;
    }
  };

  /* ===========================
    Matches Api
  ============================*/
  addMatch = async (match) => {
    try {
      await firebase
        .database()
        .ref(`Matches/${match.event_key}`)
        .set({
          uid: `${match.event_key}`,
          rating: 0,
          reviews: [],
          usersVoted: [],
          homeTeam: {
            uid: `${match.home_team_key}`,
            score: 0,
          },
          awayTeam: {
            uid: `${match.away_team_key}`,
            score: 0,
          },
        });
    } catch (error) {
      displayMessage(error.message);
    }
  };

  getAllMatches = async (clubId) => {
    const snapshot = await firebase.database().ref(`Matches`).once("value");
    let matches = [];
    snapshot.forEach((match) => {
      if (match.val().homeTeam.uid == clubId || match.val().awayTeam.uid == clubId) {
        matches.push(match.val());
      }
    });
    return matches;
  };


  getMatch = (match, callback) => {
    const ref = firebase.database().ref(`Matches/${match.event_key}`);

    ref.on("value", (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        this.addMatch(match);
      }
    });

    return ref;
  };

  getMatchReport = (id, callback) => {
    const ref = firebase.database().ref(`Matches/${id}/users/`);

    ref.on("value", (snapshot) => {
      let users = [];
      snapshot.forEach((user) => {
        users.push(user.val());
      });
      callback(users);
    });

    return ref;
  };

  updateMatch = async (matchId, data) => {
    try {
      await firebase.database().ref(`Matches/${matchId}`).update(data);
    } catch (error) {
      displayMessage(error.message);
    }
  };

  deleteMatch = async (match) => {
    try {
      await firebase.database().ref(`Matches/${match.uid}`).remove();
      displayMessage( I18n.t('Deletedsuccessfully'));
    } catch (error) {
      displayMessage(error.message);
    }
  };

  /* ===========================
    Match Analysis Api
  ============================*/
  addMatchAnalysisContent = async (matchId, data) => {
    try {
      const newReference = firebase.database().ref(`MatchAnalysis/${matchId}/`).push();

      if (data.imageVideo) {
        const image = await this.uploadMedia(
          `Clubs/${matchId}/MatchAnalysis/${newReference.key}`,
          data.imageVideo,
          data.type
        );
        data.uid = newReference.key;
        data.imageVideo = image;
      }

      await newReference.set(data);

      displayMessage(I18n.t('Addedsuccessfully'));
      return true;
    } catch (e) {
      displayMessage(e.message);
      return false;
    }
  };

  getMatchAnalysisContent = (matchId, contentId, callback) => {
    const ref = firebase.database().ref(`MatchAnalysis/${matchId}/${contentId}`);
    ref.on("value", (snapshot) => {
      callback(snapshot.val());
    });
    return ref;
  };

  getAllMatchAnalysisContent = (matchId, callback) => {
    const ref = firebase.database().ref(`MatchAnalysis/${matchId}`);

    ref.orderByChild("rating").on("value", (snapshot) => {
      let studio = [];
      snapshot.forEach((content) => {
        studio.push(content.val());
      });
      callback(studio.reverse());
    });

    return ref;
  };

  updateMatchAnalysisContent = async (matchId, contentId, data) => {
    try {
      await firebase.database().ref(`MatchAnalysis/${matchId}/${contentId}`).update(data);
      displayMessage(I18n.t('Successfullyevaluated'));
    } catch (error) {
      displayMessage(error.message);
    }
  };

  deleteMatchAnalysisContent = async (matchId, content) => {
    try {
      await firebase.database().ref(`MatchAnalysis/${matchId}/${content.uid}`).remove();
      if (content.userImage) await this.deleteMedia(content.userImage);
      if (content.imageVideo) await this.deleteMedia(content.imageVideo);
            displayMessage( I18n.t('Deletedsuccessfully'));

    } catch (error) {
      displayMessage(error.message);
    }
  };

  addCommentToMatchAnalysis = async (matchId, contentId, data) => {
    try {
      const newReference = firebase.database().ref(`MatchAnalysis/${matchId}/${contentId}/comments`).push();
      data.uid = newReference.key;
      data.createdAt = firebase.database.ServerValue.TIMESTAMP;
      await newReference.set(data);
    } catch (error) {
      displayMessage(error.message);
    }
  };

  /* ===========================
    Match Commenting Api
  ============================*/
  addMatchCommentingContent = async (matchId, data) => {
    try {
      const newReference = firebase.database().ref(`MatchCommenting/${matchId}/`).push();

      if (data.imageVideo) {
        const image = await this.uploadMedia(
          `Clubs/${matchId}/MatchCommenting/${newReference.key}`,
          data.imageVideo,
          data.type
        );
        data.uid = newReference.key;
        data.imageVideo = image;
      }

      await newReference.set(data);

            displayMessage(I18n.t('Addedsuccessfully'));
      return true;
    } catch (e) {
      displayMessage(e.message);
      return false;
    }
  };

  getMatchCommentingContent = (matchId, contentId, callback) => {
    const ref = firebase.database().ref(`MatchCommenting/${matchId}/${contentId}`);
    ref.on("value", (snapshot) => {
      callback(snapshot.val());
    });
    return ref;
  };

  getAllMatchCommentingContent = (matchId, callback) => {
    const ref = firebase.database().ref(`MatchCommenting/${matchId}`);

    ref.orderByChild("rating").on("value", (snapshot) => {
      let studio = [];
      snapshot.forEach((content) => {
        studio.push(content.val());
      });
      callback(studio.reverse());
    });
    return ref;
  };

  updateMatchCommentingContent = async (matchId, contentId, data) => {
    try {
      await firebase.database().ref(`MatchCommenting/${matchId}/${contentId}`).update(data);
            displayMessage(I18n.t('Successfullyevaluated'));

    } catch (error) {
      displayMessage(error.message);
    }
  };

  deleteMatchCommentingContent = async (matchId, content) => {
    try {
      await firebase.database().ref(`MatchCommenting/${matchId}/${content.uid}`).remove();
      if (content.userImage) await this.deleteMedia(content.userImage);
      if (content.imageVideo) await this.deleteMedia(content.imageVideo);
            displayMessage( I18n.t('Deletedsuccessfully'));

    } catch (error) {
      displayMessage(error.message);
    }
  };

  addCommentToMatchCommenting = async (matchId, contentId, data) => {
    try {
      const newReference = firebase.database().ref(`MatchCommenting/${matchId}/${contentId}/comments`).push();
      data.uid = newReference.key;
      data.createdAt = firebase.database.ServerValue.TIMESTAMP;
      await newReference.set(data);
    } catch (error) {
      displayMessage(error.message);
    }
  };

  /* ===========================
    Refree Mistakes Api
  ============================*/
  addRefereeMistakesContent = async (matchId, data) => {
    try {
      const newReference = firebase.database().ref(`RefreeMistakes/${matchId}/`).push();

      if (data.imageVideo) {
        const image = await this.uploadMedia(
          `Clubs/${matchId}/RefreeMistakes/${newReference.key}`,
          data.imageVideo,
          data.type
        );
        data.uid = newReference.key;
        data.imageVideo = image;
      }

      await newReference.set(data);

            displayMessage(I18n.t('Addedsuccessfully'));
      return true;
    } catch (e) {
      displayMessage(e.message);
      return false;
    }
  };

  getRefereeMistakesContent = (matchId, contentId, callback) => {
    const ref = firebase.database().ref(`RefreeMistakes/${matchId}/${contentId}`);
    ref.on("value", (snapshot) => {
      callback(snapshot.val());
    });
    return ref;
  };

  getAllRefereeMistakesContent = (matchId, callback) => {
    const ref = firebase.database().ref(`RefreeMistakes/${matchId}`);

    ref.orderByChild("rating").on("value", (snapshot) => {
      let studio = [];
      snapshot.forEach((content) => {
        studio.push(content.val());
      });
      callback(studio.reverse());
    });

    return ref;
  };

  updateRefereeMistakesContent = async (matchId, contentId, data) => {
    try {
      await firebase.database().ref(`RefreeMistakes/${matchId}/${contentId}`).update(data);
            displayMessage(I18n.t('Successfullyevaluated'));

    } catch (error) {
      displayMessage(error.message);
    }
  };

  deleteRefereeMistakesContent = async (matchId, content) => {
    try {
      await firebase.database().ref(`RefreeMistakes/${matchId}/${content.uid}`).remove();
      if (content.userImage) await this.deleteMedia(content.userImage);
      if (content.imageVideo) await this.deleteMedia(content.imageVideo);
            displayMessage( I18n.t('Deletedsuccessfully'));

    } catch (error) {
      displayMessage(error.message);
    }
  };

  addCommentToRefereeMistakes = async (matchId, contentId, data) => {
    try {
      const newReference = firebase.database().ref(`RefreeMistakes/${matchId}/${contentId}/comments`).push();
      data.uid = newReference.key;
      data.createdAt = firebase.database.ServerValue.TIMESTAMP;
      await newReference.set(data);
    } catch (error) {
      displayMessage(error.message);
    }
  };

  /* ===========================
    Best Shots Api
  ============================*/
  addBestShotContent = async (matchId, data) => {
    try {
      const newReference = firebase.database().ref(`BestShots/${matchId}/`).push();

      if (data.imageVideo) {
        const image = await this.uploadMedia(
          `Clubs/${matchId}/BestShots/${newReference.key}`,
          data.imageVideo,
          data.type
        );
        data.uid = newReference.key;
        data.imageVideo = image;
      }

      await newReference.set(data);

            displayMessage(I18n.t('Addedsuccessfully'));
      return true;
    } catch (e) {
      displayMessage(e.message);
      return false;
    }
  };

  getBestShotContent = (matchId, contentId, callback) => {
    const ref = firebase.database().ref(`BestShots/${matchId}/${contentId}`);
    ref.on("value", (snapshot) => {
      callback(snapshot.val());
    });
    return ref;
  };

  getAllBestShotContentt = (matchId, callback) => {
    const ref = firebase.database().ref(`BestShots/${matchId}`);

    ref.orderByChild("rating").on("value", (snapshot) => {
      let studio = [];
      snapshot.forEach((content) => {
        studio.push(content.val());
      });
      callback(studio.reverse());
    });

    return ref;
  };

  updateBestShotContent = async (matchId, contentId, data) => {
    try {
      await firebase.database().ref(`BestShots/${matchId}/${contentId}`).update(data);
            displayMessage(I18n.t('Successfullyevaluated'));

    } catch (error) {
      displayMessage(error.message);
    }
  };

  deleteBestShotContent = async (matchId, content) => {
    try {
      await firebase.database().ref(`BestShots/${matchId}/${content.uid}`).remove();
      if (content.userImage) await this.deleteMedia(content.userImage);
      if (content.imageVideo) await this.deleteMedia(content.imageVideo);
            displayMessage( I18n.t('Deletedsuccessfully'));

    } catch (error) {
      displayMessage(error.message);
    }
  };

  addCommentToBestShotContent = async (matchId, contentId, data) => {
    try {
      const newReference = firebase.database().ref(`BestShots/${matchId}/${contentId}/comments`).push();
      data.uid = newReference.key;
      data.createdAt = firebase.database.ServerValue.TIMESTAMP;
      await newReference.set(data);
    } catch (error) {
      displayMessage(error.message);
    }
  };

  /* ===========================
    Studio Api
  ============================*/
  addStudioContent = async (clubId, data) => {
    try {
      const newReference = firebase.database().ref(`Studio/${clubId}/`).push();

      if (data.imageVideo) {
        const image = await this.uploadMedia(`Clubs/${clubId}/Studio/${newReference.key}`, data.imageVideo, data.type);
        data.uid = newReference.key;
        data.imageVideo = image;
      }

      await newReference.set(data);

            displayMessage(I18n.t('Addedsuccessfully'));
      return true;
    } catch (e) {
      displayMessage(e.message);
      return false;
    }
  };

  getStudioContent = (clubId, contentId, callback) => {
    const ref = firebase.database().ref(`Studio/${clubId}/${contentId}`);
    ref.on("value", (snapshot) => {
      callback(snapshot.val());
    });
    return ref;
  };

  getAllStudioContent = (clubId, callback) => {
    const ref = firebase.database().ref(`Studio/${clubId}/`);

    ref.orderByChild("rating").on("value", (snapshot) => {
      let studio = [];
      snapshot.forEach((content) => {
        studio.push(content.val());
      });

      studio.reverse().forEach(async (content, index) => {
        var hours = Math.abs(new Date() - new Date(content.createdAt)) / 36e5;

        if (hours >= 50 && index <= 2) {
          //Add balls points to the user
          await this.updateUser(content.userId, { silverBalls: firebase.firestore.FieldValue.increment(10) });

          //delete the content
          await this.deleteStudioContent(clubId, content, false);

          studio.splice(index, 1);
        }
      });

      callback(studio);
    });

    return ref;
  };

  updateStudioContent = async (clubId, contentId, data) => {
    try {
      await firebase.database().ref(`Studio/${clubId}/${contentId}`).update(data);
            displayMessage(I18n.t('Successfullyevaluated'));

    } catch (error) {
      displayMessage(error.message);
    }
  };

  deleteStudioContent = async (clubId, content, alert = true) => {
    try {
      await firebase.database().ref(`Studio/${clubId}/${content.uid}`).remove();
      if (content.userImage) await this.deleteMedia(content.userImage);
      if (content.imageVideo) await this.deleteMedia(content.imageVideo);
      alert ? I18n.t('Deletedsuccessfully') : null;
    } catch (error) {
      displayMessage(error.message);
    }
  };

  addComment = async (clubId, contentId, data) => {
    try {
      const newReference = firebase.database().ref(`Studio/${clubId}/${contentId}/comments`).push();
      data.uid = newReference.key;
      data.createdAt = firebase.database.ServerValue.TIMESTAMP;
      await newReference.set(data);
    } catch (error) {
      displayMessage(error.message);
    }
  };

  /* ===========================
    Talent Challenges Api
  ============================*/
  addChallenge = async (data) => {
    try {
      const ref = firebase.database().ref("TalentsChallenge").push();
      data.uid = ref.key;

      if (data.thumbnail != "") {
        const url = await this.uploadMedia(`TalentsChallenge/${ref.key}/thumbnail.jpg`, data.thumbnail, "images/jpg");
        data.thumbnail = url;
      }

      if (data.music.uri != "") {
        const url = await this.uploadMedia(`TalentsChallenge/${ref.key}/music.mp3/`, data.music.uri, "audio/mp3");
        data.music.uri = url;
      }

      if (data.video) {
        const url = await this.uploadMedia(`TalentsChallenge/${ref.key}/video.mp4/`, data.video, "video/mp4");
        data.video = url;
      }

      await ref.set(data);
      displayMessage(I18n.t('Postedsuccessfully'));

      return true;
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  getAllChallenges = (callback) => {
    const ref = firebase.database().ref("TalentsChallenge/");

    ref.on("value", (snapshot) => {
      let items = [];
      snapshot.forEach((item) => {
        //check if challenge is over
        let diff = getTimeLeft(item.val());
        let dateNow = moment();
        let dateStart = moment(item.val().createdAt).add(item.val().startsIn, "hours");

        if (diff <= 0) {
          (async () => {
            if (!item.val().ballsSent) {
              let balls = item.val().balls / 2 || 0;
              await this.updateUser(item.val().user.uid, {
                silverBalls: firebase.firestore.FieldValue.increment(balls),
              });
              await this.updateChallenge(item.val().uid, { ballsSent: true });
            }

            if (diff <= -24) {
              await this.deleteChallenge(item.val());
            } else {
              if (dateStart.diff(dateNow, "hours") <= 0) {
                items.push(item.val());
              }
            }
          })();
        } else {
          if (dateStart.diff(dateNow, "hours") <= 0) {
            items.push(item.val());
          }
        }
      });
      callback(items.filter((chall) => (chall.reports ? chall.reports.length < 7 : true)));
    });

    return ref;
  };

  getChallenge = (id, callback) => {
    const ref = firebase.database().ref(`TalentsChallenge/${id}`);
    ref.on("value", (snapshot) => {
      callback(snapshot.val());
    });
    return ref;
  };

  updateChallenge = async (challengeId, data) => {
    try {
      await firebase.database().ref(`TalentsChallenge/${challengeId}`).update(data);
      return true;
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  addChallengeToFavorites = async (challengeId, user) => {
    try {
      await firebase.database().ref(`TalentsChallenge/${challengeId}/favorites/${user}`).set(true);
      return true;
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  removeChallengeFromFavorites = async (challengeId, user) => {
    try {
      await firebase.database().ref(`TalentsChallenge/${challengeId}/favorites/${user}`).remove();
      return true;
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  getAllChallengesForUser = async (user) => {
    try {
      const snapshot = await firebase.database().ref("TalentsChallenge/").once("value");
      let items = [];
      snapshot.forEach((item) => {
        if (item.val().usersAnswered) {
          if (Object.values(item.val().usersAnswered).some((answer) => answer.userId === user)) {
            items.push(item.val());
          }
        }
      });
      return items;
    } catch (error) {
      displayMessage(error.message);
      return [];
    }
  };

  deleteChallenge = async (challenge) => {
    try {
      await firebase.database().ref(`TalentsChallenge/${challenge.uid}`).remove();

      //Delete Images or Videos after deleting the challenge
      if (challenge.thumbnail) await this.deleteMedia(challenge.thumbnail);
      if (challenge.video) await this.deleteMedia(challenge.video);
      if (challenge.music.uri) await this.deleteMedia(challenge.music.uri);

           // displayMessage( I18n.t('Deletedsuccessfully'));

      return true;
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  addCommentToTalentChallenge = async (challengeId, data) => {
    try {
      const newReference = firebase.database().ref(`TalentsChallenge/${challengeId}/comments`).push();
      data.uid = newReference.key;
      data.createdAt = firebase.database.ServerValue.TIMESTAMP;
      await newReference.set(data);
    } catch (error) {
      displayMessage(error.message);
    }
  };

  addAnswerToTalentChallenge = async (challengeId, data) => {
    try {
      const newReference = firebase.database().ref(`TalentsChallenge/${challengeId}/usersAnswered`).push();
      data.uid = newReference.key;
      data.createdAt = firebase.database.ServerValue.TIMESTAMP;

      if (data.userMedia != null) {
        const url = await this.uploadMedia(
          `TalentsChallenge/${challengeId}/${data.userMedia.media}.${
            data.userMedia.type == "video/mp4" ? "mp4" : "jpg"
          }/`,
          data.userMedia.media,
          data.userMedia.type
        );
        data.userMedia.media = url;
      }
      await newReference.set(data);
      return true;
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  /* ===========================
    BestOf Api
  ============================*/
  addToBestOf = async (type, data) => {
    try {
      await firebase
        .database()
        .ref(`BestOf/${type}/${data.uid}/`)
        .set({ ...data, usersVoted: [], ballsPoints: 0 });
    } catch (error) {
      displayMessage(error.message);
    }
  };

  resetAllBestOf = async (type) => {
    const snapshot = await firebase.database().ref(`BestOf/${type}`).orderByChild("ballsPoints").once("value");
    let items = [];

    snapshot.forEach((item) => {
      if (item.val().ballsPoints != 0 && item.val().usersVoted != null) {
        items.push(item.val());
        item.ref.update({ ballsPoints: 0, usersVoted: [] });
      }
    });

    let winners = items.reverse();
    let first = winners[0];
    let second = winners[1];

    if (first && second) {
      if (first.usersVoted) {
        first.usersVoted.forEach(async (user) => {
          await this.updateUser(user.user, {
            silverBalls: firebase.firestore.FieldValue.increment(user.balls + 0.15 * first.ballsPoints),
          });
        });
      }

      if (first.ballsPoints == second.ballsPoints && second.usersVoted) {
        second.usersVoted.forEach(async (user) => {
          await this.updateUser(user.user, {
            silverBalls: firebase.firestore.FieldValue.increment(user.balls + 0.15 * second.ballsPoints),
          });
        });
      }
    }
  };

  getAllBestOf = (type, callback) => {
    const ref = firebase.database().ref(`BestOf/${type}`);

    ref.orderByChild("ballsPoints").on("value", (snapshot) => {
      let items = [];
      snapshot.forEach((item) => {
        items.push(item.val());
      });
      callback(items.reverse());
    });

    return ref;
  };

  getBestOf = async (type, id) => {
    try {
      const snapshot = await firebase.database().ref(`BestOf/${type}/${id}`).once("value");
      if (snapshot.exists()) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      displayMessage(error.message);
    }
  };

  updateBestOf = async (type, id, data) => {
    try {
      await firebase.database().ref(`BestOf/${type}/${id}`).update(data);
      return true;
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  deleteFromBestOf = async (type, id) => {
    try {
      await firebase.database().ref(`BestOf/${type}/${id}`).remove();
      return true;
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  /* ===========================
    Store Api
  ============================*/
  addToStore = async (type, data) => {
    try {
      const newReference = firebase.database().ref(`Store/${type}/`).push();
      data.uid = newReference.key;

      if (type == "GiftsStore") {
        if (data.image) {
          const image = await this.uploadMedia(`Store/${newReference.key}`, data.image, "image/jpeg");
          data.image = image;
        }
      }

      await newReference.set(data);

      if (type == "BallsStore") {
        await this.updateUser(data.user.uid, { silverBalls: firebase.firestore.FieldValue.increment(-data.amount) });
      }

            displayMessage(I18n.t('Addedsuccessfully'));
      return true;
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  getStoreItems = (type, callback) => {
    const ref = firebase.database().ref(`Store/${type}`);

    ref.orderByChild("amount").on("value", (snapshot) => {
      let items = [];
      snapshot.forEach((item) => {
        items.push(item.val());
      });
      callback(items);
    });

    return ref;
  };

  deleteStoreItem = async (type, item, shouldUpdate = true) => {
    try {
      await firebase.database().ref(`Store/${type}/${item.uid}`).remove();
      if (item.image) await this.deleteMedia(item.image);
      if (shouldUpdate) {
        await this.updateUser(this.uid, { silverBalls: firebase.firestore.FieldValue.increment(item.amount) });
      }
            displayMessage( I18n.t('Deletedsuccessfully'));

      return true;
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  updateStoreItem = async (type, id, data, cost) => {
    try {
      await firebase.database().ref(`Store/${type}/${id}`).update(data);

      if (type == "BallsStore") {
        let p = parseFloat(data.amount) - parseFloat(cost);
        await this.updateUser(this.uid, { silverBalls: firebase.firestore.FieldValue.increment(-p) });
      }

      displayMessage(I18n.t('Editedsuccessfully'));
      return true;
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  /* ===========================
    Items Api
  ============================*/
  addToUserItems = async (user, item, alert = true) => {
    try {
      const res = await this.users_db.doc(user).collection("Items").doc(`${item.uid}-${item.user.uid}`).get();
      if (res.exists) {
        await this.users_db
          .doc(user)
          .collection("Items")
          .doc(`${item.uid}-${item.user.uid}`)
          .update({ amount: firebase.firestore.FieldValue.increment(1) });
      } else {
        await this.users_db.doc(user).collection("Items").doc(`${item.uid}-${item.user.uid}`).set(item);
      }

      alert ? displayMessage(I18n.t('Ithasbeenaddedtoyourwishlist')) : null;
      return true;
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  getUserItems = async (userId) => {
    try {
      const items = await this.users_db.doc(userId).collection("Items").get();
      let list = [];
      items.forEach((documentSnapshot) => {
        list.push(documentSnapshot.data());
      });
      return list;
    } catch (error) {
      displayMessage(error.message);
      return [];
    }
  };

  updateUserItem = async (userId, itemId, data) => {
    try {
      await this.users_db.doc(userId).collection("Items").doc(itemId).update(data);
      return true;
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  deleteFromUserItems = async (userId, itemId) => {
    try {
      const res = await this.users_db.doc(userId).collection("Items").doc(itemId).get();

      if (res.data().amount == 1) {
        await this.users_db.doc(userId).collection("Items").doc(itemId).delete();
      } else {
        await this.users_db
          .doc(userId)
          .collection("Items")
          .doc(itemId)
          .update({ amount: firebase.firestore.FieldValue.increment(-1) });
      }
            displayMessage( I18n.t('Deletedsuccessfully'));

      return true;
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  /* ===========================
    Transactions Api
  ============================*/
  addTransaction = async (transaction) => {
    try {
      let key = uuidv4();
      transaction.uid = key;
      await this.transactions_db.doc(key).set(transaction);
      return true;
    } catch (error) {
      displayMessage(error.message);
      return false;
    }
  };

  getTransactions = async () => {
    try {
      const transactions = await this.transactions_db.orderBy("createdAt", "asc").get();
      let list = [];
      transactions.forEach((documentSnapshot) => {
        if (!documentSnapshot.data().paid) list.push(documentSnapshot.data());
      });
      return list;
    } catch (error) {
      displayMessage(error.message);
      return [];
    }
  };

  deleteTransaction = async (id) => {
    try {
      await this.transactions_db.doc(id).update({ paid: true });
            displayMessage( I18n.t('Deletedsuccessfully'));

    } catch (error) {
      displayMessage(error.message);
    }
  };

  /* ===========================
    Media Api
  ============================*/
  uploadMedia = async (path, uri, type) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        displayMessage("image upload error: " + e.toString());
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const ref = firebase.storage().ref().child(path);
    const snapshot = await ref.put(blob, { contentType: type });

    // We're done with the blob, close and release it
    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  deleteMedia = async (path) => {
    try {
      const ref = firebase.storage().refFromURL(path);
      await ref.delete();
    } catch (e) {
      displayMessage(e.message);
    }
  };

  get users_db() {
    return firebase.firestore().collection("Users");
  }

  get challenge_db() {
    return firebase.firestore().collection("TalentChallenges");
  }

  get transactions_db() {
    return firebase.firestore().collection("Transactions");
  }

  get terms_db() {
    return firebase.firestore().collection("Terms");
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }
}

export default new Fire();
