import React, { useEffect, useState } from "react";
import { View, StyleSheet, Share, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar } from "react-native-elements";
import { Title, Caption, Paragraph, Drawer, TouchableRipple } from "react-native-paper";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import Fire from "../Api/Fire";
import I18n from '../screens/Translation/I18n';

export function DrawerContent(props) {
  const [user, setUser] = useState({});

  useEffect(() => {
    let isMounted = true;

    const subscriber = Fire.observeUser(Fire.uid, (user) => {
      if (isMounted) setUser(user);
    });
    return () => {
      subscriber != null ? subscriber() : null;
      isMounted = false;
    };
  }, []);

  const shareApp = async () => {
    try {
      let links = await Fire.getAppLinks();

      let share =
        Platform.OS === "ios"
          ? {
              message:I18n.t('Challengeinfoshare'),
              url: links.ios || "",
            }
          : {
              message: `${I18n.t('Challengeinfoshare')} ${
                links.android || ""
              }`,
            };

      const result = await Share.share(share);

      if (result.action === Share.sharedAction) {
        // shared
        const balls = await Fire.getAllBalls("Bronze");
        await Fire.updateUser(user.uid, { silverBalls: user.silverBalls + parseInt(balls.shareApp) });
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        alert(I18n.t('Notpublished'));
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <LinearGradient
      colors={["#2b5876", "#4e4376"]}
      style={{ flex: 1, borderTopRightRadius: 25, borderBottomRightRadius: 25 }}
    >
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 30 }}>
              <Avatar
                rounded
                source={{ uri: user.image || "https://homepages.cae.wisc.edu/~ece533/images/boat.png" }}
                size={50}
                onPress={() =>
                  props.navigation.navigate("FriendsFavorite", {
                    screen: I18n.t('Atachment'),
                    params: { userId: user.uid, type: 1 },
                  })
                }
              />
              <View style={{ marginLeft: 15, flexDirection: "column" }}>
                <Title style={styles.title}>{user.username || "????"}</Title>
              
              </View>
            </View>

            <View style={styles.row}>
              <TouchableRipple
                style={styles.icon}
                onPress={() => props.navigation.navigate("FriendsFavorite", { screen: I18n.t('FriendsList') })}
              >
                <View style={styles.section}>
                  <Caption style={styles.caption}>{I18n.t('friend')}</Caption>
                  <Paragraph style={[styles.paragraph, styles.caption]}>
                    {user.friends ? user.friends.length || 0 : 0}
                  </Paragraph>
                </View>
              </TouchableRipple>
              <TouchableRipple
                style={styles.icon}
                onPress={() => props.navigation.navigate("FriendsFavorite", { screen: I18n.t('FavoriteList') })}
              >
                <View style={styles.section}>
                  <Caption style={styles.caption}>{I18n.t('afan')}</Caption>
                  <Paragraph style={[styles.paragraph, styles.caption]}>
                    {user.favorite ? user.favorite.length || 0 : 0}
                  </Paragraph>
                </View>
              </TouchableRipple>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItemList {...props} />
          </Drawer.Section>
          <Drawer.Section >
          
          </Drawer.Section>
          <Drawer.Section >
        <DrawerItem
          labelStyle={{ color: "#fff" }}
          icon={({ color, size }) => <Icon name="exit-to-app" color="#fff" size={size} />}
          label={I18n.t('SignOut')}
          onPress={() => Fire.signOut(props.navigation)}
        />
      </Drawer.Section>
        </View>
      </DrawerContentScrollView>
     
      <View>
        <Caption style={styles.ezz}></Caption>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    color: "#fff",
    marginTop: 7,
    fontWeight: "bold",
  },
  caption: {
    color: "#000",
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  paragraph: {
    fontWeight: "bold",
    marginLeft: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#fff",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  ezz: {
    alignSelf: "center",
    color: "gold",
    paddingBottom: 10,
  },
  icon: {
    backgroundColor: "white",
    marginHorizontal: 30,
    borderRadius: 10,
  },
});
