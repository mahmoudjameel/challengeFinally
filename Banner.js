import React from "react";
import { Platform, View } from "react-native";
import { AdMobBanner } from "expo-ads-admob";
const BannerAd = () => {
  const adUnitID = Platform.select({
    ios: "ca-app-pub-4465839058629486/3583784220",
    android: "ca-app-pub-3940256099942544/6300978111",
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <AdMobBanner
        adUnitID={adUnitID}
        bannerSize="banner"
        servePersonalizedAds={true}
        style={{
          padding: 20,
        }}
      />
    </View>
  );
};

export default BannerAd;
