import React from "react";
import { Dimensions } from "react-native";
import styled from "styled-components/native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ScrollView } from "react-native-gesture-handler";

const Container = styled.View`
  width: 60px;
  height: ${(Dimensions.get("screen").height / 1.7).toFixed(0)};
  padding-bottom: 10px;
  justify-content: flex-end;
`;
const Menu = styled(TouchableOpacity)`
  margin: 9px 0;
  align-items: center;
`;
const User = styled.View`
  width: 48px;
  height: 48px;
  margin-bottom: 13px;
`;
const Avatar = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 48px;
  border-width: 2px;
  border-color: #ffffff;
`;
const Count = styled.Text`
  color: #fff;
  font-size: 12px;
  letter-spacing: -0.1px;
`;
const SoundBg = styled.View`
  background: #1f191f;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const Sidebar = ({
  sameUser,
  avatar,
  count,
  type,
  onPressChat,
  onPressVote,
  onPressNavigate,
  onPressGift,
  onPressMute,
  onPressReport,
  onPressAnswer,
  onPressShare,
}) => {
  const [mute, setMute] = React.useState(false);

  return (
    <Container>
      <ScrollView style={{ flex: 1 }}>
        <Menu onPress={onPressNavigate}>
          <User>
            <Avatar resizeMode="cover" source={{ uri: avatar }} />
          </User>
        </Menu>

        {type == 1 || sameUser ? (
          <Menu onPress={onPressAnswer}>
            <FontAwesome5 name="check-double" size={24} color="#fff" />
            <Count>{count.answers}</Count>
          </Menu>
        ) : null}

        <Menu onPress={onPressVote}>
          <FontAwesome5 name="star" size={24} color="#fff" />
          <Count>{count.reviews}</Count>
        </Menu>

        {type == 1 ? (
          <Menu onPress={onPressChat}>
            <FontAwesome5 name="comment-dots" size={24} color="#fff" />
            <Count>{count.comment}</Count>
          </Menu>
        ) : null}

        {type == 1 && !sameUser ? (
          <Menu onPress={onPressReport}>
            <FontAwesome5 name="flag" size={24} color="#fff" />
            <Count>{count.flags}</Count>
          </Menu>
        ) : null}

        {type == 1 && !sameUser ? (
          <Menu onPress={onPressGift}>
            <FontAwesome5 name="gift" size={24} color="#fff" />
          </Menu>
        ) : null}

        <Menu onPress={onPressShare}>
          <FontAwesome5 name="share" size={24} color="#fff" />
        </Menu>

        <Menu>
          <TouchableOpacity
            onPress={() => {
              onPressMute();
              setMute(!mute);
            }}
          >
            <SoundBg>
              {mute ? (
                <Ionicons name="volume-mute-outline" size={24} color="#fff" />
              ) : (
                <Ionicons name="volume-high-outline" size={24} color="#fff" />
              )}
            </SoundBg>
          </TouchableOpacity>
        </Menu>
      </ScrollView>
    </Container>
  );
};

export default Sidebar;
