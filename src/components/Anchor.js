import React from "react";
import { Text, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";

const handlePress = (href) => {
  WebBrowser.openBrowserAsync(href);
};

const Anchor = (props) => (
  <TouchableOpacity {...props} onPress={() => handlePress(props.href)}>
    <Text {...props} style={{ color: "silver" }}>
      {props.children}
    </Text>
  </TouchableOpacity>
);

export default Anchor;
