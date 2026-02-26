// HomeScreen.js - Buttons moved up by ~1 inch (roughly 100px)
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const translations = {
  en: {
    title: 'IMPOSTER ROOM',
    tagline: 'Lies. Clues. Chaos.',
    newGame: 'NEW GAME',
    howToPlay: 'HOW TO PLAY',
    language: 'LANGUAGE',
  },
  lt: {
    title: 'IMPOSTER ROOM',
    tagline: 'Melas. Užuominos. Chaosas.',
    newGame: 'NAUJAS ŽAIDIMAS',
    howToPlay: 'KAIP ŽAISTI',
    language: 'KALBA',
  }
};

const Particle = ({ delay, colors, screenWidth, screenHeight }) => {
  const position = useRef(new Animated.ValueXY({ 
    x: Math.random() * screenWidth, 
    y: screenHeight + 50 
  })).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(position.y, {
            toValue: -50,
            duration: 8000 + Math.random() * 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, { toValue: 0.6, duration: 1000, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 1000, delay: 6000, useNativeDriver: true }),
          ]),
        ]),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const particleColor = Math.random() > 0.5 ? colors.primary : colors.accent;

  return (
    <Animated.View
      style={[
        particleStyles.particle,
        { transform: position.getTranslateTransform(), opacity, backgroundColor: particleColor },
      ]}
    />
  );
};

const particleStyles = StyleSheet.create({
  particle: { position: 'absolute', width: 2, height: 2, borderRadius: 1 },
});

const AnimatedButton = ({ children, style, onPress, colors, isDarkMode, secondary }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, friction: 5 }).start();
    if (!secondary) Animated.timing(glowAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
    if (!secondary) Animated.timing(glowAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity style={style} onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} activeOpacity={0.9}>
        {!secondary && isDarkMode && (
          <Animated.View style={[buttonStyles.buttonGlow, { opacity: glowAnim, shadowColor: colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20 }]} />
        )}
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const buttonStyles = StyleSheet.create({
  buttonGlow: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'transparent' },
});

export default function HomeScreen({ navigation, route }) {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const lang = route.params?.language || 'en';
  const t = translations[lang];

  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const flickerAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ])).start();

    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.02, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ])).start();

    const flicker = () => {
      Animated.sequence([
        Animated.timing(flickerAnim, { toValue: 0.8, duration: 50, useNativeDriver: true }),
        Animated.timing(flickerAnim, { toValue: 1, duration: 50, useNativeDriver: true }),
        Animated.delay(3000 + Math.random() * 2000),
      ]).start(flicker);
    };
    flicker();
  }, []);

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] });
  const styles = getStyles(colors, isDarkMode, glowOpacity, lang);

  const particles = Array.from({ length: 15 }, (_, i) => (
    <Particle key={i} delay={i * 500} colors={colors} screenWidth={width} screenHeight={height} />
  ));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <View style={styles.particlesContainer}>{particles}</View>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme} activeOpacity={0.7}>
            <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={22} color={isDarkMode ? '#fff' : '#000'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.languageButton} onPress={() => navigation.navigate('SelectLanguage', { currentLang: lang })}>
            <Text style={styles.flagText}>{lang === 'lt' ? '🇱🇹' : '🇬🇧'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Animated.View style={[styles.titleWrapper, { transform: [{ scale: pulseAnim }], opacity: flickerAnim }]}>
            <Text style={styles.title}>{t.title}</Text>
            {isDarkMode && <Animated.View style={[styles.glowOverlay, { opacity: glowOpacity }]} />}
          </Animated.View>
          <Text style={styles.tagline}>{t.tagline}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <AnimatedButton style={styles.mainButton} onPress={() => navigation.navigate('CreateRoom', { language: lang })} colors={colors} isDarkMode={isDarkMode}>
            <Text style={styles.buttonText}>{t.newGame}</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
          </AnimatedButton>

          <AnimatedButton style={styles.secondaryButton} onPress={() => navigation.navigate('HowToPlay', { language: lang })} colors={colors} isDarkMode={isDarkMode} secondary>
            <Ionicons name="help-circle-outline" size={20} color={isDarkMode ? '#fff' : '#000'} style={styles.buttonIconLeft} />
            <Text style={styles.secondaryButtonText}>{t.howToPlay}</Text>
          </AnimatedButton>

          <AnimatedButton style={styles.secondaryButton} onPress={() => navigation.navigate('SelectLanguage', { currentLang: lang })} colors={colors} isDarkMode={isDarkMode} secondary>
            <Ionicons name="globe-outline" size={20} color={isDarkMode ? '#fff' : '#000'} style={styles.buttonIconLeft} />
            <Text style={styles.secondaryButtonText}>{t.language}</Text>
            <Text style={styles.flagInButton}>{lang === 'lt' ? '🇱🇹' : '🇬🇧'}</Text>
          </AnimatedButton>
        </View>

        <Text style={styles.version}>v1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode, glowOpacity, lang) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  particlesContainer: { position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
    paddingTop: 100,  // Increased to accommodate buttons moving up
    paddingBottom: 40 
  },
  topBar: { 
    position: 'absolute',
    top: 50,  // Position near top of screen (below status bar)
    left: 20,
    right: 20,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    zIndex: 10,
  },
  themeToggle: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: colors.surface, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageButton: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: colors.surface, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flagText: { fontSize: 24 },
  logoContainer: { 
    alignItems: 'center', 
    marginBottom: 20,
    marginTop: 40,  // Push logo down so it doesn't overlap with top buttons
  },
  logo: { width: 80, height: 80, marginBottom: 15 },
  titleWrapper: { position: 'relative' },
  title: { 
    fontSize: 36, 
    fontWeight: '900', 
    color: isDarkMode ? '#fff' : '#000', 
    letterSpacing: 6, 
    textShadowColor: isDarkMode ? colors.primary : 'transparent', 
    textShadowOffset: { width: 0, height: 0 }, 
    textShadowRadius: isDarkMode ? 20 : 0 
  },
  glowOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.primary, opacity: 0.3, borderRadius: 10, transform: [{ scale: 1.2 }], zIndex: -1 },
  tagline: { 
    fontSize: lang === 'lt' ? 14 : 18, 
    color: '#00ffff',
    marginTop: 15,
    marginBottom: 50, 
    fontWeight: '700', 
    letterSpacing: lang === 'lt' ? 2 : 4, 
    textTransform: 'uppercase',
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  buttonContainer: { width: '100%', maxWidth: 320, gap: 16 },
  mainButton: { 
    backgroundColor: colors.primary, 
    paddingVertical: 20, 
    paddingHorizontal: 30, 
    borderRadius: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    position: 'relative', 
    overflow: 'hidden', 
    borderWidth: 2, 
    borderColor: '#000',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDarkMode ? 0.4 : 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 3 },
  buttonIcon: { marginLeft: 12 },
  secondaryButton: { 
    backgroundColor: colors.surface, 
    paddingVertical: 18, 
    paddingHorizontal: 25, 
    borderRadius: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 2, 
    borderColor: '#000',
  },
  secondaryButtonText: { 
    color: isDarkMode ? '#fff' : '#000', 
    fontSize: 16, 
    fontWeight: '700', 
    letterSpacing: 2 
  },
  buttonIconLeft: { marginRight: 12 },
  flagInButton: { fontSize: 18, marginLeft: 12 },
  version: { 
    position: 'absolute', 
    bottom: 20, 
    color: isDarkMode ? '#fff' : '#000', 
    fontSize: 12, 
    letterSpacing: 2 
  },
});
