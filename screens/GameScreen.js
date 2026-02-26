// HowToPlayScreen.js - Fixed light mode visibility
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const translations = {
  en: {
    title: 'HOW TO PLAY',
    step1: 'Gather Your Crew',
    step1Text: 'Round up 3 to 12 players. Everyone grabs a seat in the circle of trust... or deception.',
    step2: 'The Secret Word',
    step2Text: 'Each round, everyone except the Spy sees the secret word. The Spy is left in the dark, scrambling to blend in.',
    step3: 'Drop Your Clues',
    step3Text: 'Go around and give a one-word clue related to the secret word. Be clever, but not too obvious!',
    step4: 'The Hot Seat',
    step4Text: 'When the timer hits, the accused faces 30 seconds of intense questioning. Can they talk their way out?',
    step5: 'Cast Your Votes',
    step5Text: 'Everyone votes on who they think is the Spy. Majority rules. Choose wisely.',
    step6: 'The Reveal',
    step6Text: 'If the Spy fools the group — Spies win! If caught red-handed — Agents take the victory!',
    proTips: 'PRO TIPS',
    tip1: '• Spies: Listen carefully and mirror the energy. Vague is your friend.',
    tip2: '• Agents: Watch for hesitation or clues that don\'t quite fit.',
    tip3: '• Random Round: When everyone\'s a Spy, paranoia hits maximum. Trust no one.',
    back: 'BACK',
  },
  lt: {
    title: 'KAIP ŽAISTI',
    step1: 'Surinkite Komandą',
    step1Text: 'Sušaukite 3–12 žaidėjų. Visi atsisėda pasitikėjimo rate... arba apgaulės.',
    step2: 'Slaptas Žodis',
    step2Text: 'Kiekvieno rato metu visi, išskyrus Šnipą, mato slaptą žodį. Šnipas lieka tamsoje ir bando prisitaikyti.',
    step3: 'Meskite Užuominas',
    step3Text: 'Eikite ratu ir duokite po vieną žodį susijusį su slaptu žodžiu. Būkite protingi, bet ne per daug akivaizdūs!',
    step4: 'Karšta Kėdė',
    step4Text: 'Kai laikmatis sueina, įtariamasis patiria 30 sekundžių intensyvių klausimų. Ar išsisuks?',
    step5: 'Balsuokite',
    step5Text: 'Visi balsuoja, kas yra Šnipas. Dauguma nusprendžia. Rinkitės protingai.',
    step6: 'Atskleidimas',
    step6Text: 'Jei Šnipas apgauna grupę — laimi Šnipai! Jei pagautas — Agentai švenčia pergalę!',
    proTips: 'PATARIMAI PROFIAMS',
    tip1: '• Šnipai: Klausykitės atidžiai ir atkartokite energiją. Neaiškumas — jūsų draugas.',
    tip2: '• Agentai: Stebėkite dvejones ar užuominas, kurios kiek neįtinka.',
    tip3: '• Atsitiktinis Ratas: Kai visi yra Šnipai, paranoja pasiekia viršūnę. Nepasitikėkite niekuo.',
    back: 'ATGAL',
  }
};

export default function HowToPlayScreen({ navigation, route }) {
  const { colors, isDarkMode } = useTheme();
  const lang = route.params?.language || 'en';
  const t = translations[lang];
  const styles = getStyles(colors, isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#fff' : '#000'} />
          </TouchableOpacity>
          <Text style={styles.title}>{t.title}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.stepsContainer}>
          {[
            { emoji: '🎮', title: t.step1, text: t.step1Text },
            { emoji: '🕵️', title: t.step2, text: t.step2Text },
            { emoji: '💬', title: t.step3, text: t.step3Text },
            { emoji: '🔥', title: t.step4, text: t.step4Text },
            { emoji: '🗳️', title: t.step5, text: t.step5Text },
            { emoji: '🏆', title: t.step6, text: t.step6Text },
          ].map((step, i) => (
            <View key={i} style={styles.stepCard}>
              <Text style={styles.stepNumber}>{step.emoji}</Text>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>{t.proTips}</Text>
          <Text style={styles.tipText}>{t.tip1}</Text>
          <Text style={styles.tipText}>{t.tip2}</Text>
          <Text style={styles.tipText}>{t.tip3}</Text>
        </View>

        <TouchableOpacity style={styles.backButtonLarge} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backButtonText}>{t.back}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 20, paddingTop: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { 
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    backgroundColor: colors.surface, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#000' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: isDarkMode ? '#fff' : '#000', 
    letterSpacing: 2, 
    textShadowColor: isDarkMode ? colors.primary : 'transparent', 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: isDarkMode ? 2 : 0 
  },
  placeholder: { width: 44 },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 120, height: 120 },
  stepsContainer: { gap: 15, marginBottom: 25 },
  stepCard: { 
    backgroundColor: colors.surface, 
    padding: 20, 
    borderRadius: 16, 
    borderWidth: 2, 
    borderColor: '#000', 
    shadowColor: colors.shadow, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: isDarkMode ? 0.2 : 0.05, 
    shadowRadius: 4, 
    elevation: 2 
  },
  stepNumber: { fontSize: 32, marginBottom: 10 },
  stepTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: isDarkMode ? '#fff' : '#000', 
    marginBottom: 8, 
    letterSpacing: 1 
  },
  stepText: { 
    fontSize: 14, 
    color: isDarkMode ? '#fff' : '#000', 
    lineHeight: 20 
  },
  tipsCard: { 
    backgroundColor: colors.primary + '15', 
    padding: 20, 
    borderRadius: 16, 
    borderWidth: 2, 
    borderColor: colors.primary, 
    marginBottom: 25 
  },
  tipsTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: isDarkMode ? '#fff' : '#000', 
    marginBottom: 15, 
    letterSpacing: 1 
  },
  tipText: { 
    fontSize: 14, 
    color: isDarkMode ? '#fff' : '#000', 
    marginBottom: 8, 
    lineHeight: 20 
  },
  backButtonLarge: { 
    backgroundColor: colors.primary, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 16, 
    borderRadius: 12, 
    gap: 10, 
    borderWidth: 2, 
    borderColor: '#000' 
  },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
});
