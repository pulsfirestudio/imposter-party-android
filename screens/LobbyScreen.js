import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const translations = {
  en: {
    title: 'LOBBY',
    waiting: 'Waiting for players...',
    start: 'START GAME',
    leave: 'LEAVE',
    players: 'PLAYERS',
  },
  lt: {
    title: 'LOBIJUS',
    waiting: 'Laukiama žaidėjų...',
    start: 'PRADĖTI ŽAIDIMĄ',
    leave: 'IŠEITI',
    players: 'ŽAIDĖJAI',
  }
};

export default function LobbyScreen({ navigation, route }) {
  const { colors, isDarkMode } = useTheme();
  const lang = route.params?.language || 'en';
  const t = translations[lang];
  const players = ['Player 1', 'Player 2', 'Player 3'];
  const styles = getStyles(colors, isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>{t.title}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>ROOM CODE</Text>
          <Text style={styles.codeText}>ABC123</Text>
        </View>

        <View style={styles.playersSection}>
          <Text style={styles.sectionTitle}>{t.players} ({players.length})</Text>
          <View style={styles.playersList}>
            {players.map((player, index) => (
              <View key={index} style={styles.playerCard}>
                <Text style={styles.playerNumber}>#{index + 1}</Text>
                <Text style={styles.playerName}>{player}</Text>
                {index === 0 && (
                  <View style={styles.hostBadge}>
                    <Text style={styles.hostText}>HOST</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.waitingText}>{t.waiting}</Text>

        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>{t.start}</Text>
          <Ionicons name="play" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.leaveButton} onPress={() => navigation.goBack()}>
          <Ionicons name="exit-outline" size={20} color="#ff1a1a" />
          <Text style={styles.leaveButtonText}>{t.leave}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.border },
  title: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: 2, textShadowColor: isDarkMode ? colors.primary : 'transparent', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: isDarkMode ? 2 : 0 },
  placeholder: { width: 44 },
  codeContainer: { backgroundColor: colors.surface, padding: 25, borderRadius: 16, alignItems: 'center', marginBottom: 30, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed' },
  codeLabel: { fontSize: 12, color: '#fff', letterSpacing: 2, marginBottom: 10 },
  codeText: { fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: 8 },
  playersSection: { marginBottom: 30 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#fff', letterSpacing: 2, marginBottom: 15 },
  playersList: { gap: 10 },
  playerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 15, borderRadius: 12, borderWidth: 2, borderColor: colors.border, gap: 15 },
  playerNumber: { color: '#fff', fontWeight: '700', width: 30 },
  playerName: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '600' },
  hostBadge: { backgroundColor: colors.primary, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 },
  hostText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  waitingText: { textAlign: 'center', color: '#fff', marginBottom: 30, fontStyle: 'italic' },
  startButton: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 12, marginBottom: 15, gap: 10, borderWidth: 2, borderColor: colors.primary },
  startButtonText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 2 },
  leaveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, borderWidth: 2, borderColor: '#ff1a1a', gap: 10 },
  leaveButtonText: { color: '#ff1a1a', fontSize: 16, fontWeight: '700' },
});
