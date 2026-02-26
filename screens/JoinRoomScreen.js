import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const translations = {
  en: {
    title: 'JOIN ROOM',
    roomCode: 'ROOM CODE',
    enterCode: 'Enter 6-digit code...',
    yourName: 'YOUR NAME',
    enterName: 'Enter your name...',
    join: 'JOIN GAME',
    back: 'BACK',
    invalidCode: 'Invalid code!',
    noName: 'Please enter your name',
  },
  lt: {
    title: 'PRISIJUNGTI',
    roomCode: 'KAMBARIO KODAS',
    enterCode: 'Įveskite 6 skaitmenų kodą...',
    yourName: 'JŪSŲ VARDAS',
    enterName: 'Įveskite vardą...',
    join: 'PRISIJUNGTI',
    back: 'ATGAL',
    invalidCode: 'Neteisingas kodas!',
    noName: 'Įveskite vardą',
  }
};

export default function JoinRoomScreen({ navigation, route }) {
  const { colors, isDarkMode } = useTheme();
  const lang = route.params?.language || 'en';
  const t = translations[lang];
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const styles = getStyles(colors, isDarkMode);

  const handleJoin = () => {
    if (!playerName.trim()) { Alert.alert('Error', t.noName); return; }
    if (roomCode.length !== 6) { Alert.alert('Error', t.invalidCode); return; }
    Alert.alert('Coming Soon', 'Online multiplayer will be available in a future update!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>{t.title}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.roomCode}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.enterCode}
              placeholderTextColor="#fff"
              value={roomCode}
              onChangeText={setRoomCode}
              maxLength={6}
              autoCapitalize="characters"
              color="#fff"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.yourName}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.enterName}
              placeholderTextColor="#fff"
              value={playerName}
              onChangeText={setPlayerName}
              maxLength={15}
              color="#fff"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
          <Text style={styles.joinButtonText}>{t.join}</Text>
          <Ionicons name="enter" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButtonLarge} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t.back}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.border },
  title: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: 2, textShadowColor: isDarkMode ? colors.primary : 'transparent', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: isDarkMode ? 2 : 0 },
  placeholder: { width: 44 },
  form: { gap: 25, marginBottom: 40 },
  inputGroup: { gap: 10 },
  label: { fontSize: 14, fontWeight: '800', color: '#fff', letterSpacing: 2 },
  input: { backgroundColor: colors.surface, borderRadius: 12, padding: 18, borderWidth: 2, borderColor: colors.border, fontSize: 16, color: '#fff' },
  joinButton: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 12, marginBottom: 15, gap: 10, borderWidth: 2, borderColor: colors.primary },
  joinButtonText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 2 },
  backButtonLarge: { backgroundColor: colors.surface, paddingVertical: 16, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: colors.border },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 1 },
});
