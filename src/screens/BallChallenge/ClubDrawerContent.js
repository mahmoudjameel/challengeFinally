import React from "react";
import { View, StyleSheet } from "react-native";
import { Drawer } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";

export function ClubDrawerContent(props) {
  return (
    <LinearGradient
      colors={["#2b5876", "#4e4376"]}
      style={{ flex: 1, borderTopLeftRadius: 25, borderBottomLeftRadius: 25 }}
    >
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItemList {...props} />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  drawerSection: {
    marginTop: 35,
  },
});
