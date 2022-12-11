import React, { useEffect, useState } from "react";
import { Video, Audio } from "expo-av";
import styled from "styled-components/native";

const Play = styled(Video)`
  height: 100%;
`;

const VideoPlayer = ({ isPause, isMute, video, music, poster }) => {
  const [sound, setSound] = useState();
  const [status, setStatus] = useState({});

  const playSound = async (music) => {
    if (music == null) return;
    if (!music.uri) return;
    if (sound) return;
    const { sound } = await Audio.Sound.createAsync({ uri: music.uri });
    setSound(sound);
    await sound.playAsync();
  };
  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
}, []);
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    (async () => {
      if (status.didJustFinish && sound) await sound.replayAsync();
    })();
  }, [status]);

  //Play music
  useEffect(() => {
    playSound(music);
  }, [music]);

  //Pause and resume
  useEffect(() => {
    (async () => {
      if (isPause && sound) await sound.playAsync();
      if (!isPause && sound) await sound.pauseAsync();
    })();
  }, [isPause]);

  // Mute and unmute
  useEffect(() => {
    if (isMute && sound) sound.setIsMutedAsync(true);
    if (!isMute && sound) sound.setIsMutedAsync(false);
  }, [isMute]);

  return (
    <Play
      rate={1.0}
      volume={1.0}
      isLooping={true}
      isMuted={isMute}
      shouldPlay={isPause}
      useNativeControls={false}
      onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      posterSource={{ uri: poster }}
      source={{ uri: video }}
      resizeMode="cover"
    />
  );
};

export default VideoPlayer;
