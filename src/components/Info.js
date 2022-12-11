import React from "react";

import { Feather } from "@expo/vector-icons";

import styled from "styled-components/native";
import { Text } from "react-native";
import { View } from "react-native-animatable";
import I18n from '../screens/Translation/I18n';

const Container = styled.View`
  flex: 1;
  justify-content: flex-end;
  margin: 0 0 25px 13px;
`;
const User = styled.View`
  flex-direction: row;
  align-items: center;
`;
const UserName = styled.Text`
  font-size: 17px;
  color: rgba(255, 255, 255, 1);
  text-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  letter-spacing: -0.3px;
`;
const Checked = styled.Image`
  width: 16px;
  height: 16px;
  margin: 0 5px;
`;
const Description = styled.Text`
  font-size: 17px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: -0.2px;
  margin-top: 6px;
  width: 80%;
`;
const Music = styled.Text`
  margin-top: 13px;
  width: 80%;
`;

const Info = ({ user, title, music }) => {
  return (
    <Container>
      <User>
        <UserName>@{user.username}</UserName>
        <Checked source={{ uri: user.image }} />
      </User>
      <Description>{title}</Description>
      {/* <Music>
        <View>
          <Feather name="music" size={30} color="#fff" />
        </View>
        <View>
          <Text style={{ margin: 10, fontSize: 15, color: "#fff" }}>{music.name || I18n.t('Thereismusic')}</Text>
        </View>
      </Music> */}
    </Container>
  );
};

export default Info;
