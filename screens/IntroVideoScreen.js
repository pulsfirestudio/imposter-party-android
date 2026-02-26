import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, TouchableOpacity, Text } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function IntroVideoScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const player = useRef(null);

  const videoPlayer = useVideoPlayer(require('../assets/studio-intro.mp4'), (playerInstance) => {
    player.current = playerInstance;
    playerInstance.loop = false;
    playerInstance.play();
  });

  useEffect(() => {
    if (!videoPlayer) return;

    const subscription = videoPlayer.addListener('playToEnd', () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('Home');
      });
    });

    return () => {
      subscription.remove();
    };
  }, [videoPlayer, navigation, fadeAnim]);

  const skipVideo = () => {
    if (player.current) {
      player.current.pause();
    }
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.videoContainer, { opacity: fadeAnim }]}>
        <VideoView
          player={videoPlayer}
          style={styles.video}
          contentFit="contain"
          nativeControls={false}
        />
        
        {/* Skip button */}
        <TouchableOpacity style={styles.skipButton} onPress={skipVideo}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    width: width,
    height: height,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  skipButton: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  skipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
