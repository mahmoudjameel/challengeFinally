import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import { Drawer, TouchableRipple, Switch } from "react-native-paper";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";
import Fire from "../../Api/Fire";
import { displayMessage } from "../../util/extraMethods";

const AdminMainscreen = () => {
  const [state, setState] = useState({ loading: false, display: false });

  //Bronze Subscription settings
  const [bronzeBalls, setBronzeBalls] = useState({
    newAccount: "50",
    shareApp: "2",
    openPrivateChatWritten: "20",
    openPrivateChatVoice: "35",
    enterBallChallenge: "3",
    createMatchAnalysis: "5",
    recordMatchCommenting: "3",
    refreeMistakes: "20",
    cupVoting: "20",
    createTalentChallenge: "30",
    talentDuration: "24",
    talentVideoDuration: "45",
    noAd: false,
    replyToChallenge: "15",
    createAnAd: "10",
    joinChatForOtherClubs: false,
    price: "0",
    minBallsToSell: "10000",
    transferBalls: "40",
    createBestShot: "20",
  });

  //Silver Subscription settings
  const [silverBalls, setSilverBalls] = useState({
    openPrivateChatWritten: "15",
    openPrivateChatVoice: "30",
    openPrivateChatVideo: "2",
    enterBallChallenge: "2",
    createMatchAnalysis: "4",
    recordMatchCommenting: "2",
    refreeMistakes: "15",
    cupVoting: "15",
    createTalentChallenge: "25",
    talentDuration: "48",
    talentVideoDuration: "90",
    noAd: false,
    replyToChallenge: "10",
    createAnAd: "8",
    joinChatForOtherClubs: false,
    price: "10",
    minBallsToSell: "10000",
    transferBalls: "40",
    createBestShot: "15",
  });

  //Gold Subscription settings
  const [goldBalls, setGoldBalls] = useState({
    openPrivateChatWritten: "10",
    openPrivateChatVoice: "20",
    openPrivateChatVideo: "1",
    enterBallChallenge: "1",
    createMatchAnalysis: "2",
    recordMatchCommenting: "1",
    refreeMistakes: "10",
    cupVoting: "10",
    createTalentChallenge: "15",
    talentDuration: "72",
    talentVideoDuration: "180",
    noAd: true,
    replyToChallenge: "6",
    createAnAd: "5",
    joinChatForOtherClubs: true,
    price: "20",
    minBallsToSell: "10000",
    transferBalls: "40",
    createBestShot: "10",
  });

  //Get current Data
  useEffect(() => {
    retrieveBalls();
  }, []);

  //Get current Balls Data
  const retrieveBalls = async () => {
    const bronzeBalls = await Fire.getAllBalls("Bronze");
    const silverBalls = await Fire.getAllBalls("Silver");
    const goldBalls = await Fire.getAllBalls("Gold");
    setBronzeBalls(bronzeBalls);
    setSilverBalls(silverBalls);
    setGoldBalls(goldBalls);
    setState({ ...state, display: true });
  };

  //On loading
  const renderLoading = () => {
    if (state.loading) {
      return <ActivityIndicator style={{ marginTop: 10 }} animating color="#fff" size="large" />;
    } else {
      return (
        <TouchableOpacity
          style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
          rippleColor="#86E0FF"
          onPress={updatePoints}
        >
          <LinearGradient
            colors={["#02aab0", "#00cdac"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.bold}>تأكيد</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }
  };

  const updatePoints = async () => {
    //Display Loading icon
    setState((prevState) => {
      return { ...prevState, loading: true };
    });

    const responseBronze = await Fire.updateBalls("Bronze", bronzeBalls);
    if (!responseBronze) return displayMessage(responseBronze);
    const responseSilver = await Fire.updateBalls("Silver", silverBalls);
    if (!responseSilver) return displayMessage(responseSilver);
    const responseGold = await Fire.updateBalls("Gold", goldBalls);
    if (!responseGold) return displayMessage(responseGold);

    displayMessage("تم التحديث بنجاح");
    //Hide Loading icon
    setState((prevState) => {
      return { ...prevState, loading: false };
    });
  };

  return (
    <LinearGradient colors={["#2b5876", "#4e4376"]} style={styles.container}>
      {state.display ? (
        <DrawerContentScrollView>
          <View style={{ width: "100%", alignItems: "center", marginBottom: 20, marginTop: 20 }}>
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "bold" }}>العضوية البرونزية</Text>
          </View>
          <Drawer.Section style={{ borderBottomColor: "#fff" }}>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setBronzeBalls((prevState) => {
                      return { ...prevState, newAccount: text };
                    });
                  }}
                  value={bronzeBalls.newAccount}
                />
              </View>
              <Text style={styles.bold}>كرات هدية تسجيل حساب</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setBronzeBalls((prevState) => {
                      return { ...prevState, shareApp: text };
                    });
                  }}
                  value={bronzeBalls.shareApp}
                />
              </View>
              <Text style={styles.bold}>كرات هدية نشر التطبيق</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setBronzeBalls((prevState) => {
                      return { ...prevState, openPrivateChatWritten: text };
                    });
                  }}
                  value={bronzeBalls.openPrivateChatWritten}
                />
              </View>
              <Text style={styles.bold}>كرات فتح محادثة خاصة كتابية</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setBronzeBalls((prevState) => {
                      return { ...prevState, openPrivateChatVoice: text };
                    });
                  }}
                  value={bronzeBalls.openPrivateChatVoice}
                />
              </View>
              <Text style={styles.bold}>كرات فتح محادثة خاصة صوتية</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "#fff", paddingLeft: 10 }}
                  keyboardType="numeric"
                  editable={false}
                  value={"لا يستطيع"}
                />
              </View>
              <Text style={styles.bold}>كرات فتح محادثة خاصة فيديو</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "gold" }}>كورة ذهبية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "gold", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setBronzeBalls((prevState) => {
                      return { ...prevState, enterBallChallenge: text };
                    });
                  }}
                  value={bronzeBalls.enterBallChallenge}
                />
              </View>
              <Text style={styles.bold}>دخول تحدي مباراة </Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "gold" }}>كورة ذهبية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "gold", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setBronzeBalls((prevState) => {
                      return { ...prevState, createMatchAnalysis: text };
                    });
                  }}
                  value={bronzeBalls.createMatchAnalysis}
                />
              </View>
              <Text style={styles.bold}>انشاء تحليل رياضي</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setBronzeBalls((prevState) => {
                      return { ...prevState, createBestShot: text };
                    });
                  }}
                  value={bronzeBalls.createBestShot}
                />
              </View>
              <Text style={styles.bold}>نشر لقطة في المباراة</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "gold" }}>كورة ذهبية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "gold", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setBronzeBalls((prevState) => {
                      return { ...prevState, recordMatchCommenting: text };
                    });
                  }}
                  value={bronzeBalls.recordMatchCommenting}
                />
              </View>
              <Text style={styles.bold}>تسجيل تعليق صوتي للمبارة </Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setBronzeBalls((prevState) => {
                      return { ...prevState, refreeMistakes: text };
                    });
                  }}
                  value={bronzeBalls.refreeMistakes}
                />
              </View>
              <Text style={styles.bold}>اضافة لقطة في قسم الاخطاء التحكيمية</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setBronzeBalls((prevState) => {
                      return { ...prevState, cupVoting: text };
                    });
                  }}
                  value={bronzeBalls.cupVoting}
                />
              </View>
              <Text style={styles.bold}>ترشيحات الكأس اللاعبين</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setBronzeBalls((prevState) => {
                      return { ...prevState, createTalentChallenge: text };
                    });
                  }}
                  value={bronzeBalls.createTalentChallenge}
                />
              </View>
              <Text style={styles.bold}>إنشاء تحدي مواهب</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setBronzeBalls((prevState) => {
                      return { ...prevState, minBallsToSell: text };
                    });
                  }}
                  value={bronzeBalls.minBallsToSell}
                />
              </View>
              <Text style={styles.bold}>اقل كرات للبيع</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>%</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setBronzeBalls((prevState) => {
                      return { ...prevState, transferBalls: text };
                    });
                  }}
                  value={bronzeBalls.transferBalls}
                />
              </View>
              <Text style={styles.bold}>نسبة الخصم عند تحويل الكرات</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "#fff" }}>ساعة</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "#fff", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setBronzeBalls((prevState) => {
                      return { ...prevState, talentDuration: text };
                    });
                  }}
                  value={bronzeBalls.talentDuration}
                />
              </View>
              <Text style={styles.bold}>بقاء التحدي على الساحة </Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setBronzeBalls((prevState) => {
                      return { ...prevState, replyToChallenge: text };
                    });
                  }}
                  value={bronzeBalls.replyToChallenge}
                />
              </View>
              <Text style={styles.bold}>الرد على التحديات والمشاركة فيها </Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "gold" }}>كورة ذهبية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "gold", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setBronzeBalls((prevState) => {
                      return { ...prevState, createAnAd: text };
                    });
                  }}
                  value={bronzeBalls.createAnAd}
                />
              </View>
              <Text style={styles.bold}>اضافة إعلان </Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "#fff" }}>ثانية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "#fff", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setBronzeBalls((prevState) => {
                      return { ...prevState, talentVideoDuration: text };
                    });
                  }}
                  value={bronzeBalls.talentVideoDuration}
                />
              </View>
              <Text style={styles.bold}>مدة المقطع في التحديات </Text>
            </View>
            <TouchableRipple
              rippleColor="#86E0FF"
              onPress={() =>
                setBronzeBalls((prevState) => {
                  return { ...prevState, joinChatForOtherClubs: !bronzeBalls.joinChatForOtherClubs };
                })
              }
            >
              <View style={styles.preference}>
                <View pointerEvents="none">
                  <Switch value={bronzeBalls.joinChatForOtherClubs} />
                </View>
                <Text style={styles.bold}>دخول شات غير شات النادي المفضل </Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              rippleColor="#86E0FF"
              onPress={() =>
                setBronzeBalls((prevState) => {
                  return { ...prevState, noAd: !bronzeBalls.noAd };
                })
              }
            >
              <View style={styles.preference}>
                <View pointerEvents="none">
                  <Switch value={bronzeBalls.noAd} />
                </View>
                <Text style={styles.bold}>نسخة بدون اعلانات مبوبة </Text>
              </View>
            </TouchableRipple>
          </Drawer.Section>

          <View style={{ width: "100%", alignItems: "center", marginBottom: 20, marginTop: 20 }}>
            <Text style={{ color: "silver", fontSize: 15, fontWeight: "bold" }}>العضوية الفضية</Text>
          </View>
          <Drawer.Section>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "gold" }}>ريال</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "gold", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setSilverBalls((prevState) => {
                      return { ...prevState, price: text };
                    });
                  }}
                  value={silverBalls.price}
                />
              </View>
              <Text style={styles.bold}>سعر الاشتراك</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setSilverBalls((prevState) => {
                      return { ...prevState, openPrivateChatWritten: text };
                    });
                  }}
                  value={silverBalls.openPrivateChatWritten}
                />
              </View>
              <Text style={styles.bold}>كرات فتح محادثة خاصة كتابية</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setSilverBalls((prevState) => {
                      return { ...prevState, openPrivateChatVoice: text };
                    });
                  }}
                  value={silverBalls.openPrivateChatVoice}
                />
              </View>
              <Text style={styles.bold}>كرات فتح محادثة خاصة صوتية</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "gold" }}>كورة ذهبية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "gold", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setSilverBalls((prevState) => {
                      return { ...prevState, openPrivateChatVideo: text };
                    });
                  }}
                  value={silverBalls.openPrivateChatVideo}
                />
              </View>
              <Text style={styles.bold}>كرات فتح محادثة خاصة فيديو</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "gold" }}>كورة ذهبية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "gold", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setSilverBalls((prevState) => {
                      return { ...prevState, enterBallChallenge: text };
                    });
                  }}
                  value={silverBalls.enterBallChallenge}
                />
              </View>
              <Text style={styles.bold}>دخول تحدي مباراة </Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "gold" }}>كورة ذهبية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "gold", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setSilverBalls((prevState) => {
                      return { ...prevState, createMatchAnalysis: text };
                    });
                  }}
                  value={silverBalls.createMatchAnalysis}
                />
              </View>
              <Text style={styles.bold}>انشاء تحليل رياضي</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setSilverBalls((prevState) => {
                      return { ...prevState, createBestShot: text };
                    });
                  }}
                  value={silverBalls.createBestShot}
                />
              </View>
              <Text style={styles.bold}>نشر لقطة في المباراة</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "gold" }}>كورة ذهبية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "gold", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setSilverBalls((prevState) => {
                      return { ...prevState, recordMatchCommenting: text };
                    });
                  }}
                  value={silverBalls.recordMatchCommenting}
                />
              </View>
              <Text style={styles.bold}>تسجيل تعليق صوتي للمبارة </Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setSilverBalls((prevState) => {
                      return { ...prevState, refreeMistakes: text };
                    });
                  }}
                  value={silverBalls.refreeMistakes}
                />
              </View>
              <Text style={styles.bold}>اضافة لقطة في قسم الاخطاء التحكيمية</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setSilverBalls((prevState) => {
                      return { ...prevState, cupVoting: text };
                    });
                  }}
                  value={silverBalls.cupVoting}
                />
              </View>
              <Text style={styles.bold}>ترشيحات الكأس اللاعبين</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setSilverBalls((prevState) => {
                      return { ...prevState, createTalentChallenge: text };
                    });
                  }}
                  value={silverBalls.createTalentChallenge}
                />
              </View>
              <Text style={styles.bold}>إنشاء تحدي مواهب</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setSilverBalls((prevState) => {
                      return { ...prevState, minBallsToSell: text };
                    });
                  }}
                  value={silverBalls.minBallsToSell}
                />
              </View>
              <Text style={styles.bold}>اقل كرات للبيع</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>%</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setSilverBalls((prevState) => {
                      return { ...prevState, transferBalls: text };
                    });
                  }}
                  value={silverBalls.transferBalls}
                />
              </View>
              <Text style={styles.bold}>نسبة الخصم عند تحويل الكرات</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "#fff" }}>ساعة</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "#fff", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setSilverBalls((prevState) => {
                      return { ...prevState, talentDuration: text };
                    });
                  }}
                  value={silverBalls.talentDuration}
                />
              </View>
              <Text style={styles.bold}>بقاء التحدي على الساحة </Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setSilverBalls((prevState) => {
                      return { ...prevState, replyToChallenge: text };
                    });
                  }}
                  value={silverBalls.replyToChallenge}
                />
              </View>
              <Text style={styles.bold}>الرد على التحديات والمشاركة فيها </Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "gold" }}>كورة ذهبية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "gold", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setSilverBalls((prevState) => {
                      return { ...prevState, createAnAd: text };
                    });
                  }}
                  value={silverBalls.createAnAd}
                />
              </View>
              <Text style={styles.bold}>اضافة إعلان </Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "#fff" }}>ثانية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "#fff", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setSilverBalls((prevState) => {
                      return { ...prevState, talentVideoDuration: text };
                    });
                  }}
                  value={silverBalls.talentVideoDuration}
                />
              </View>
              <Text style={styles.bold}>مدة المقطع في التحديات </Text>
            </View>
            <TouchableRipple
              rippleColor="#86E0FF"
              onPress={() =>
                setSilverBalls((prevState) => {
                  return { ...prevState, joinChatForOtherClubs: !silverBalls.joinChatForOtherClubs };
                })
              }
            >
              <View style={styles.preference}>
                <View pointerEvents="none">
                  <Switch value={silverBalls.joinChatForOtherClubs} />
                </View>
                <Text style={styles.bold}>دخول شات غير شات النادي المفضل </Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              rippleColor="#86E0FF"
              onPress={() =>
                setSilverBalls((prevState) => {
                  return { ...prevState, noAd: !silverBalls.noAd };
                })
              }
            >
              <View style={styles.preference}>
                <View pointerEvents="none">
                  <Switch value={silverBalls.noAd} />
                </View>
                <Text style={styles.bold}>نسخة بدون اعلانات مبوبة </Text>
              </View>
            </TouchableRipple>
          </Drawer.Section>

          <View style={{ width: "100%", alignItems: "center", marginBottom: 20, marginTop: 20 }}>
            <Text style={{ color: "gold", fontSize: 15, fontWeight: "bold" }}>العضوية الذهبية</Text>
          </View>
          <Drawer.Section>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "gold" }}>ريال</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "gold", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setGoldBalls((prevState) => {
                      return { ...prevState, price: text };
                    });
                  }}
                  value={goldBalls.price}
                />
              </View>
              <Text style={styles.bold}>سعر الاشتراك</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setGoldBalls((prevState) => {
                      return { ...prevState, openPrivateChatWritten: text };
                    });
                  }}
                  value={goldBalls.openPrivateChatWritten}
                />
              </View>
              <Text style={styles.bold}>كرات فتح محادثة خاصة كتابية</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "gold" }}>كورة ذهبية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "gold", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setGoldBalls((prevState) => {
                      return { ...prevState, openPrivateChatVoice: text };
                    });
                  }}
                  value={goldBalls.openPrivateChatVoice}
                />
              </View>
              <Text style={styles.bold}>كرات فتح محادثة خاصة صوتية</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "gold" }}>كورة ذهبية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "gold", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setGoldBalls((prevState) => {
                      return { ...prevState, openPrivateChatVideo: text };
                    });
                  }}
                  value={goldBalls.openPrivateChatVideo}
                />
              </View>
              <Text style={styles.bold}>كرات فتح محادثة خاصة فيديو</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "gold" }}>كورة ذهبية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "gold", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setGoldBalls((prevState) => {
                      return { ...prevState, enterBallChallenge: text };
                    });
                  }}
                  value={goldBalls.enterBallChallenge}
                />
              </View>
              <Text style={styles.bold}>دخول تحدي مباراة </Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "gold" }}>كورة ذهبية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "gold", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setGoldBalls((prevState) => {
                      return { ...prevState, createMatchAnalysis: text };
                    });
                  }}
                  value={goldBalls.createMatchAnalysis}
                />
              </View>
              <Text style={styles.bold}>انشاء تحليل رياضي</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setGoldBalls((prevState) => {
                      return { ...prevState, createBestShot: text };
                    });
                  }}
                  value={goldBalls.createBestShot}
                />
              </View>
              <Text style={styles.bold}>نشر لقطة في المباراة</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "gold" }}>كورة ذهبية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "gold", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setGoldBalls((prevState) => {
                      return { ...prevState, recordMatchCommenting: text };
                    });
                  }}
                  value={goldBalls.recordMatchCommenting}
                />
              </View>
              <Text style={styles.bold}>تسجيل تعليق صوتي للمبارة </Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setGoldBalls((prevState) => {
                      return { ...prevState, refreeMistakes: text };
                    });
                  }}
                  value={goldBalls.refreeMistakes}
                />
              </View>
              <Text style={styles.bold}>اضافة لقطة في قسم الاخطاء التحكيمية</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setGoldBalls((prevState) => {
                      return { ...prevState, cupVoting: text };
                    });
                  }}
                  value={goldBalls.cupVoting}
                />
              </View>
              <Text style={styles.bold}>ترشيحات الكأس اللاعبين</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setGoldBalls((prevState) => {
                      return { ...prevState, createTalentChallenge: text };
                    });
                  }}
                  value={goldBalls.createTalentChallenge}
                />
              </View>
              <Text style={styles.bold}>إنشاء تحدي مواهب</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setGoldBalls((prevState) => {
                      return { ...prevState, minBallsToSell: text };
                    });
                  }}
                  value={goldBalls.minBallsToSell}
                />
              </View>
              <Text style={styles.bold}>اقل كرات للبيع</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>%</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setGoldBalls((prevState) => {
                      return { ...prevState, transferBalls: text };
                    });
                  }}
                  value={goldBalls.transferBalls}
                />
              </View>
              <Text style={styles.bold}>نسبة الخصم عند تحويل الكرات</Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "#fff" }}>ساعة</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "#fff", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setGoldBalls((prevState) => {
                      return { ...prevState, talentDuration: text };
                    });
                  }}
                  value={goldBalls.talentDuration}
                />
              </View>
              <Text style={styles.bold}>بقاء التحدي على الساحة </Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "silver" }}>كورة فضية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "silver", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setGoldBalls((prevState) => {
                      return { ...prevState, replyToChallenge: text };
                    });
                  }}
                  value={goldBalls.replyToChallenge}
                />
              </View>
              <Text style={styles.bold}>الرد على التحديات والمشاركة فيها </Text>
            </View>
            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "gold" }}>كورة ذهبية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "gold", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setGoldBalls((prevState) => {
                      return { ...prevState, createAnAd: text };
                    });
                  }}
                  value={goldBalls.createAnAd}
                />
              </View>
              <Text style={styles.bold}>اضافة إعلان </Text>
            </View>

            <View style={styles.preference}>
              <View style={styles.action}>
                <Text style={{ color: "#fff" }}>ثانية</Text>
                <TextInput
                  placeholderTextColor="silver"
                  style={{ color: "#fff", padding: 2, marginLeft: 10, borderBottomWidth: 1 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setGoldBalls((prevState) => {
                      return { ...prevState, talentVideoDuration: text };
                    });
                  }}
                  value={goldBalls.talentVideoDuration}
                />
              </View>
              <Text style={styles.bold}>مدة المقطع في التحديات </Text>
            </View>
            <TouchableRipple
              rippleColor="#86E0FF"
              onPress={() =>
                setGoldBalls((prevState) => {
                  return { ...prevState, joinChatForOtherClubs: !goldBalls.joinChatForOtherClubs };
                })
              }
            >
              <View style={styles.preference}>
                <View pointerEvents="none">
                  <Switch value={goldBalls.joinChatForOtherClubs} />
                </View>
                <Text style={styles.bold}>دخول شات غير شات النادي المفضل </Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              rippleColor="#86E0FF"
              onPress={() =>
                setGoldBalls((prevState) => {
                  return { ...prevState, noAd: !goldBalls.noAd };
                })
              }
            >
              <View style={styles.preference}>
                <View pointerEvents="none">
                  <Switch value={goldBalls.noAd} />
                </View>
                <Text style={styles.bold}>نسخة بدون اعلانات مبوبة </Text>
              </View>
            </TouchableRipple>
          </Drawer.Section>
        </DrawerContentScrollView>
      ) : (
        <ActivityIndicator style={{ marginTop: 10 }} animating color={"#fff"} size={"large"} />
      )}
      {renderLoading()}
    </LinearGradient>
  );
};

export default AdminMainscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  preference: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bold: {
    color: "#fff",
    fontWeight: "bold",
  },
  action: { flexDirection: "row", alignItems: "center" },
  button: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    borderRadius: 10,
    padding: 15,
  },
});
