// utils/SoundManager.js
import { Audio } from 'expo-av';

let _soundEnabled = true;
export function setSoundEnabled(val) { _soundEnabled = val; }

const SoundManager = {
  preloadAll: async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: false,
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
      });
    } catch (e) {
      console.warn('SoundManager preload error:', e);
    }
  },

  unloadAll: async () => {},

  playCountdownBeep: async () => {
    if (!_soundEnabled) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/countdown_beep.wav')
      );
      await sound.setVolumeAsync(0.8);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((s) => { if (s.didJustFinish) sound.unloadAsync(); });
    } catch (e) { console.warn('beep error:', e); }
  },

  playTimesUp: async () => {
    if (!_soundEnabled) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/Times up.mp3')
      );
      await sound.setVolumeAsync(1.0);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((s) => { if (s.didJustFinish) sound.unloadAsync(); });
    } catch (e) { console.warn('timesup error:', e); }
  },

  playSpyRevealed: async () => {
    if (!_soundEnabled) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/spy_revealed.wav')
      );
      await sound.setVolumeAsync(0.9);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((s) => { if (s.didJustFinish) sound.unloadAsync(); });
    } catch (e) { console.warn('spy error:', e); }
  },
};

export default SoundManager;