import { ToastAndroid, Platform } from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

//Display Message
export const displayMessage = (message) => {
  if (Platform.OS === "android") return ToastAndroid.show(message, ToastAndroid.LONG);
  if (Platform.OS === "ios") return alert(message);
};

//Send Notification to user
export const sendPushNotification = async (expoPushToken, title, body, data) => {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: body,
    data: { data: data },
    channelId: "chat-messages",
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { Accept: "application/json", "Accept-encoding": "gzip, deflate", "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
};

//Get Token for the user
export const registerForPushNotificationsAsync = async () => {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("chat-messages", {
      name: "chat-messages",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: true,
      enableVibrate: true,
    });
  }

  return token;
};

//Set up notifications
export const setUpNotificationHandler = async () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false }),
  });
};

//Get time of a date
export const formatTime = (date, amPmFormate) => {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var strTime = "";

  if (amPmFormate) {
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    strTime = hours + ":" + minutes + " " + ampm;
  } else {
    minutes = minutes < 10 ? "0" + minutes : minutes;
    strTime = hours + ":" + minutes;
  }

  return strTime;
};

export const formatMatchTimer = (time) => {
  var minutes = "0" + Math.floor(time / 60);
  var seconds = "0" + (time - minutes * 60);
  return minutes.substr(-2) + ":" + seconds.substr(-2);
};

//Get time of a date
export const getMililsec = (time) => {
  var timeParts = time.split(":");
  return +timeParts[0] * (60000 * 60) + +timeParts[1] * 60000;
};

//Get hours between two dates
export const getTimeLeft = (itemData) => {
  let dateEnd = new Date(itemData.createdAt);
  dateEnd.setHours(dateEnd.getHours() + itemData.challengeDuration);
  return ((dateEnd - new Date()) / 36e5).toFixed(0);
};

export const convertArabicNumbers = (number) => {
  return number
    .replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d) {
      return d.charCodeAt(0) - 1632;
    })
    .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function (d) {
      return d.charCodeAt(0) - 1776;
    });
};
export const formatTimeString = (time, showMsecs) => {
  let msecs = time % 1000;

  if (msecs < 10) {
    msecs = `00${msecs}`;
  } else if (msecs < 100) {
    msecs = `0${msecs}`;
  }

  let seconds = Math.floor(time / 1000);
  let minutes = Math.floor(time / 60000);
  let hours = Math.floor(time / 3600000);
  seconds = seconds - minutes * 60;
  minutes = minutes - hours * 60;
  let formatted;
  if (showMsecs) {
    formatted = `${hours < 10 ? 0 : ""}${hours}:${minutes < 10 ? 0 : ""}${minutes}:${
      seconds < 10 ? 0 : ""
    }${seconds}:${msecs}`;
  } else {
    formatted = `${hours < 10 ? 0 : ""}${hours}:${minutes < 10 ? 0 : ""}${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
  }

  return formatted;
};
