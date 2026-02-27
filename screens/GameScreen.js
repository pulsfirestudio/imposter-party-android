// GameScreen.js - stable full rewrite (hold to reveal, pass button, discussion transition)
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const translations = {
  en: {
    revealPhase: "REVEAL PHASE",
    holdToSee: "Hold to reveal",
    yourRole: "YOUR ROLE",
    agent: "AGENT",
    spy: "SPY",
    word: "The word is:",
    cluePhase: "CLUE PHASE",
    giveClue: "Drop your clue",
    interrogation: "INTERROGATION",
    voting: "VOTING",
    whoIsSpy: "Who is the spy?",
    results: "RESULTS",
    agentsWin: "AGENTS WIN!",
    spiesWin: "SPIES WIN!",
    playAgain: "PLAY AGAIN",
    home: "HOME",
    passTo: "Pass to",
    timeUp: "Time's Up!",
    fireQuestions: "Fire your questions!",
    hiddenRoles: "Hidden Roles:",
    voterVotes: "votes:",
  },
  lt: {
    revealPhase: "ATSKLEIDIMO FAZĖ",
    holdToSee: "Laikykite atskleidimui",
    yourRole: "JŪSŲ ROLĖ",
    agent: "AGENTAS",
    spy: "ŠNIPAS",
    word: "Žodis yra:",
    cluePhase: "UŽUOMINŲ FAZĖ",
    giveClue: "Meskite užuominą",
    interrogation: "APIKLAUSA",
    voting: "BALSUOJIMAS",
    whoIsSpy: "Kas yra šnipas?",
    results: "REZULTATAI",
    agentsWin: "AGENTAI LAIMĖJO!",
    spiesWin: "ŠNIPAI LAIMĖJO!",
    playAgain: "ŽAISTI DAR KARTĄ",
    home: "PRADŽIA",
    passTo: "Perduokite",
    timeUp: "Laikas baigėsi!",
    fireQuestions: "Užduokite klausimus!",
    hiddenRoles: "Slaptos rolės:",
    voterVotes: "balsuoja:",
  },
};

export default function GameScreen({ navigation, route }) {
  const { colors, isDarkMode } = useTheme();

  const {
    players = [],
    secretWord,
    imposterIndices = [],
    clueAssist = false,
    category,
    language = "en",
    timeLimit = false,
    timePerPerson = 15,
  } = route.params || {};

  const t = translations[language] || translations.en;

  // phases: reveal -> clues -> interrogation -> voting -> results
  const [phase, setPhase] = useState("reveal");

  // REVEAL phase state
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isHoldingReveal, setIsHoldingReveal] = useState(false);
  const [hasRevealedThisPlayer, setHasRevealedThisPlayer] = useState(false);
  const [isPassing, setIsPassing] = useState(false);

  // timers
  const defaultTimedSeconds = useMemo(
    () => (timeLimit ? timePerPerson : 30),
    [timeLimit, timePerPerson]
  );
  const [timeLeft, setTimeLeft] = useState(defaultTimedSeconds);

  // Clues
  const [clues, setClues] = useState([]);
  const [pressedButton, setPressedButton] = useState(null);

  // Voting (stable)
  const [votes, setVotes] = useState({}); // suspectIndex -> count
  const [voterIndex, setVoterIndex] = useState(0);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const isCurrentPlayerSpy = imposterIndices.includes(currentPlayerIndex);

  const styles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

  // Animation loops
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    glow.start();

    return () => {
      pulse.stop();
      glow.stop();
    };
  }, [pulseAnim, glowAnim]);

  const resetTimer = () => setTimeLeft(defaultTimedSeconds);

  // Timer tick for clues + interrogation
  useEffect(() => {
    const isTimedPhase = phase === "clues" || phase === "interrogation";
    if (!isTimedPhase) return;

    if (timeLeft <= 0) {
      if (phase === "clues") {
        submitClue(t.timeUp);
      } else {
        startVoting();
      }
      return;
    }

    const id = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft, t.timeUp]);

  // -------- REVEAL FLOW --------

  const handleRevealPressIn = () => {
    if (isPassing) return;
    setIsHoldingReveal(true);
    setHasRevealedThisPlayer(true);
  };

  const handleRevealPressOut = () => {
    setIsHoldingReveal(false);
  };

  const handlePassNext = () => {
    if (!hasRevealedThisPlayer) return;
    if (isPassing) return;
    if (isHoldingReveal) return;

    setIsPassing(true);
    setIsHoldingReveal(false);

    setTimeout(() => {
      const isLastPlayer = currentPlayerIndex >= players.length - 1;

      if (!isLastPlayer) {
        setCurrentPlayerIndex((prev) => prev + 1);
        setHasRevealedThisPlayer(false);
        setIsPassing(false);
        return;
      }

      // ✅ last player finished reveal -> go to Discussion screen
      setHasRevealedThisPlayer(false);
      setIsPassing(false);

      navigation.replace("Discussion", {
        players,
        language,
        categoryId: category?.id ?? null,
        categoryName: category?.name ?? category ?? null,
        word: secretWord,
        imposterIndices,
        spyIndex: Array.isArray(imposterIndices) ? imposterIndices[0] : null,
      });
    }, 150);
  };

  // -------- CLUES --------

  const submitClue = (clueText) => {
    setClues((prev) => [...prev, { player: players[currentPlayerIndex], clue: clueText }]);

    const isLastPlayer = currentPlayerIndex >= players.length - 1;

    if (!isLastPlayer) {
      setCurrentPlayerIndex((prev) => prev + 1);
      resetTimer();
      return;
    }

    // Finished clue round -> interrogation
    setCurrentPlayerIndex(0);
    setPhase("interrogation");
    resetTimer();
  };

  // -------- VOTING --------

  const startVoting = () => {
    setPhase("voting");
    setVotes({});
    setVoterIndex(0);
  };

  const voteForPlayer = (suspectIndex) => {
    if (suspectIndex === voterIndex) return;

    setVotes((prev) => {
      const next = { ...prev };
      next[suspectIndex] = (next[suspectIndex] || 0) + 1;
      return next;
    });

    if (voterIndex >= players.length - 1) {
      setPhase("results");
    } else {
      setVoterIndex((prev) => prev + 1);
    }
  };

  const getWinner = () => {
    const voteValues = Object.values(votes);
    if (voteValues.length === 0) return "spies";

    const maxVotes = Math.max(...voteValues);
    const mostVotedKey = Object.keys(votes).find((k) => votes[k] === maxVotes);
    if (mostVotedKey == null) return "spies";

    const mostVotedIndex = parseInt(mostVotedKey, 10);
    const caughtSpy = imposterIndices.includes(mostVotedIndex);
    return caughtSpy ? "agents" : "spies";
  };

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.75] });

  // -------- RENDERS --------

  const renderRevealPhase = () => (
    <View style={styles.phaseContainer}>
      <Text style={styles.phaseTitle}>{t.revealPhase}</Text>
      <Text style={styles.playerName}>{players[currentPlayerIndex]}</Text>

      <View style={styles.revealButtonWrapper}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[styles.revealButton, isPassing && { opacity: 0.7 }]}
            onPressIn={handleRevealPressIn}
            onPressOut={handleRevealPressOut}
            activeOpacity={0.95}
            disabled={isPassing}
          >
            {isDarkMode && <Animated.View style={[styles.revealGlow, { opacity: glowOpacity }]} />}
            <Ionicons name="eye" size={40} color="#fff" />
            <Text style={styles.revealText}>{t.holdToSee}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {isHoldingReveal && (
        <View style={styles.roleOverlay} pointerEvents="none">
          <View style={[styles.roleCard, isCurrentPlayerSpy ? styles.spyCard : styles.agentCard]}>
            <Text style={styles.roleTitle}>{t.yourRole}</Text>
            <Text style={[styles.roleText, isCurrentPlayerSpy ? styles.spyText : styles.agentText]}>
              {isCurrentPlayerSpy ? t.spy : t.agent}
            </Text>

            {!isCurrentPlayerSpy && (
              <View style={styles.wordBox}>
                <Text style={styles.wordLabel}>{t.word}</Text>
                <Text style={styles.wordText}>{secretWord}</Text>
              </View>
            )}

            {isCurrentPlayerSpy && clueAssist && (
              <View style={styles.hintBox}>
                <Text style={styles.hintLabel}>Category: {category?.name ?? category ?? "-"}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.passButton,
          (!hasRevealedThisPlayer || isPassing || isHoldingReveal) && styles.passButtonDisabled,
        ]}
        onPress={handlePassNext}
        disabled={!hasRevealedThisPlayer || isPassing || isHoldingReveal}
        activeOpacity={0.9}
      >
        <Ionicons name="swap-horizontal" size={20} color="#fff" />
        <Text style={styles.passButtonText}>
          {t.passTo} {players[(currentPlayerIndex + 1) % players.length]}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCluesPhase = () => (
    <View style={styles.phaseContainer}>
      <Text style={styles.phaseTitle}>{t.cluePhase}</Text>
      <Text style={styles.playerName}>{players[currentPlayerIndex]}</Text>

      {timeLimit && (
        <View style={styles.timerContainerSmall}>
          <Text style={[styles.timerTextSmall, timeLeft <= 5 && styles.timerWarning]}>{timeLeft}s</Text>
          <View style={styles.timerBarSmall}>
            <View
              style={[
                styles.timerFillSmall,
                { width: `${Math.max(0, (timeLeft / timePerPerson) * 100)}%` },
                timeLeft <= 5 && styles.timerFillWarning,
              ]}
            />
          </View>
        </View>
      )}

      <View style={styles.cluesList}>
        {clues.map((c, i) => (
          <View key={i} style={styles.clueItem}>
            <Text style={styles.cluePlayer}>{c.player}</Text>
            <Text style={styles.clueText}>"{c.clue}"</Text>
          </View>
        ))}
      </View>

      <Text style={styles.clueLabel}>{t.giveClue}</Text>

      <View style={styles.clueButtons}>
        {["Good", "Bad", "Weird", "Funny", "Smart"].map((clue) => (
          <TouchableOpacity
            key={clue}
            style={[styles.clueButton, pressedButton === clue && styles.clueButtonPressed]}
            onPress={() => submitClue(clue)}
            onPressIn={() => setPressedButton(clue)}
            onPressOut={() => setPressedButton(null)}
            activeOpacity={0.9}
          >
            <Text style={styles.clueButtonText}>{clue}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderInterrogation = () => (
    <View style={styles.phaseContainer}>
      <Text style={styles.phaseTitle}>{t.interrogation}</Text>
      <Text style={styles.playerName}>{players[currentPlayerIndex]}</Text>

      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, timeLeft <= 10 && styles.timerWarning]}>{timeLeft}s</Text>
        <View style={styles.timerBar}>
          <View
            style={[
              styles.timerFill,
              { width: `${Math.max(0, (timeLeft / defaultTimedSeconds) * 100)}%` },
              timeLeft <= 10 && styles.timerFillWarning,
            ]}
          />
        </View>
      </View>

      <Text style={styles.interrogationText}>{t.fireQuestions}</Text>
    </View>
  );

  const renderVoting = () => (
    <View style={styles.phaseContainer}>
      <Text style={styles.phaseTitle}>{t.voting}</Text>
      <Text style={styles.votingText}>{t.whoIsSpy}</Text>

      <Text style={styles.voterName}>
        {players[voterIndex]} {t.voterVotes}
      </Text>

      <View style={styles.votingGrid}>
        {players.map((player, index) => {
          if (index === voterIndex) return null;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.voteButton,
                pressedButton === `vote${index}` && styles.voteButtonPressed,
              ]}
              onPress={() => voteForPlayer(index)}
              onPressIn={() => setPressedButton(`vote${index}`)}
              onPressOut={() => setPressedButton(null)}
              activeOpacity={0.9}
            >
              <Text style={styles.voteButtonText}>{player}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderResults = () => {
    const winner = getWinner();

    return (
      <View style={styles.phaseContainer}>
        <Text style={styles.phaseTitle}>{t.results}</Text>

        <View style={[styles.winnerCard, winner === "agents" ? styles.agentWinCard : styles.spyWinCard]}>
          <Text style={[styles.winnerText, winner === "agents" ? styles.agentWinText : styles.spyWinText]}>
            {winner === "agents" ? t.agentsWin : t.spiesWin}
          </Text>
        </View>

        <View style={styles.revealCard}>
          <Text style={styles.revealTitle}>{t.word}</Text>
          <Text style={styles.revealWord}>{secretWord}</Text>

          <Text style={styles.spiesTitle}>{t.hiddenRoles}</Text>
          {imposterIndices.map((idx) => (
            <Text key={idx} style={styles.spyName}>🕵️ {players[idx]}</Text>
          ))}
        </View>

        <View style={styles.resultButtons}>
          <TouchableOpacity
            style={styles.resultButton}
            onPress={() => navigation.replace("CreateRoom", { language })}
            activeOpacity={0.9}
          >
            <Text style={styles.resultButtonText}>{t.playAgain}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resultButton, styles.homeButton]}
            onPress={() => navigation.navigate("Home", { language })}
            activeOpacity={0.9}
          >
            <Text style={styles.resultButtonText}>{t.home}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {phase === "reveal" && renderRevealPhase()}
        {phase === "clues" && renderCluesPhase()}
        {phase === "interrogation" && renderInterrogation()}
        {phase === "voting" && renderVoting()}
        {phase === "results" && renderResults()}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors, isDarkMode) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { flexGrow: 1, padding: 20 },
    phaseContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 40,
      paddingBottom: 30,
    },
    phaseTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: isDarkMode ? "#fff" : "#000",
      letterSpacing: 4,
      marginBottom: 20,
    },
    playerName: {
      fontSize: 26,
      fontWeight: "800",
      color: isDarkMode ? "#fff" : "#000",
      marginBottom: 25,
    },

    revealButtonWrapper: { zIndex: 2 },
    revealButton: {
      backgroundColor: colors.primary,
      width: 180,
      height: 180,
      borderRadius: 90,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
      borderWidth: 2,
      borderColor: "#000",
    },
    revealGlow: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: colors.primary,
    },
    revealText: {
      color: "#fff",
      fontWeight: "700",
      marginTop: 10,
      fontSize: 13,
      letterSpacing: 1,
    },

    roleOverlay: {
      position: "absolute",
      top: 40,
      left: 20,
      right: 20,
      alignItems: "center",
      zIndex: 3,
    },
    roleCard: {
      marginTop: 22,
      padding: 30,
      borderRadius: 20,
      alignItems: "center",
      borderWidth: 2,
      minWidth: 280,
      backgroundColor: colors.surface,
    },
    agentCard: {
      borderColor: isDarkMode ? colors.success : "#000",
    },
    spyCard: {
      borderColor: isDarkMode ? colors.error : "#000",
    },
    roleTitle: {
      fontSize: 11,
      color: isDarkMode ? "#fff" : "#000",
      marginBottom: 10,
      letterSpacing: 3,
      fontWeight: "700",
    },
    roleText: {
      fontSize: 22,
      fontWeight: "800",
      marginBottom: 8,
      letterSpacing: 2,
    },
    agentText: { color: "#00ff88" },
    spyText: { color: "#ff1a1a" },

    wordBox: {
      backgroundColor: colors.background,
      padding: 18,
      borderRadius: 14,
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#000",
    },
    wordLabel: {
      fontSize: 12,
      color: isDarkMode ? "#fff" : "#000",
      marginBottom: 5,
      letterSpacing: 2,
    },
    wordText: {
      fontSize: 36,
      fontWeight: "900",
      letterSpacing: 2,
      color: isDarkMode ? "#fff" : "#000",
    },

    hintBox: {
      backgroundColor: (colors.accent || "#fff") + "20",
      padding: 14,
      borderRadius: 12,
      marginTop: 10,
      borderWidth: 2,
      borderColor: colors.accent || "#000",
    },
    hintLabel: {
      color: isDarkMode ? "#fff" : "#000",
      fontWeight: "700",
      fontSize: 13,
    },

    passButton: {
      position: "absolute",
      bottom: 30,
      left: 20,
      right: 20,
      backgroundColor: colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 18,
      borderRadius: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      borderWidth: 2,
      borderColor: "#000",
    },
    passButtonDisabled: { opacity: 0.5 },
    passButtonText: {
      color: "#fff",
      fontWeight: "800",
      fontSize: 14,
      letterSpacing: 1,
    },

    cluesList: { width: "100%", marginBottom: 25 },
    clueItem: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 14,
      marginBottom: 10,
      borderWidth: 2,
      borderColor: "#000",
    },
    cluePlayer: {
      color: isDarkMode ? "#fff" : "#000",
      fontWeight: "700",
      marginBottom: 5,
      fontSize: 13,
    },
    clueText: {
      color: isDarkMode ? "#fff" : "#000",
      fontSize: 18,
      fontStyle: "italic",
    },
    clueLabel: {
      color: isDarkMode ? "#fff" : "#000",
      marginBottom: 20,
      fontSize: 14,
      letterSpacing: 2,
    },
    clueButtons: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 10,
    },
    clueButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: "#000",
      transform: [{ scale: 1 }],
    },
    clueButtonPressed: { transform: [{ scale: 0.95 }] },
    clueButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },

    timerContainer: { alignItems: "center", marginBottom: 30 },
    timerText: {
      fontSize: 72,
      fontWeight: "900",
      color: isDarkMode ? "#fff" : "#000",
      marginBottom: 20,
    },
    timerWarning: { color: "#ff1a1a" },
    timerBar: {
      width: 250,
      height: 6,
      backgroundColor: isDarkMode ? colors.border : "#cccccc",
      borderRadius: 3,
      overflow: "hidden",
    },
    timerFill: { height: "100%", backgroundColor: colors.primary },
    timerFillWarning: { backgroundColor: "#ff1a1a" },

    timerContainerSmall: { width: "100%", marginBottom: 20, alignItems: "center" },
    timerTextSmall: {
      fontSize: 24,
      fontWeight: "800",
      color: isDarkMode ? "#fff" : "#000",
      marginBottom: 10,
    },
    timerBarSmall: {
      width: "80%",
      height: 6,
      backgroundColor: isDarkMode ? colors.border : "#cccccc",
      borderRadius: 3,
      overflow: "hidden",
    },
    timerFillSmall: { height: "100%", backgroundColor: colors.primary },

    interrogationText: { color: isDarkMode ? "#fff" : "#000", fontSize: 18, fontStyle: "italic" },

    votingText: { fontSize: 18, color: isDarkMode ? "#fff" : "#000", marginBottom: 15 },
    voterName: { fontSize: 14, color: isDarkMode ? "#fff" : "#000", marginBottom: 25 },
    votingGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12 },
    voteButton: {
      backgroundColor: colors.surface,
      paddingVertical: 16,
      paddingHorizontal: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: "#000",
      minWidth: 120,
      alignItems: "center",
      transform: [{ scale: 1 }],
    },
    voteButtonPressed: { transform: [{ scale: 0.97 }], borderColor: colors.primary },
    voteButtonText: { color: isDarkMode ? "#fff" : "#000", fontWeight: "700", fontSize: 16 },

    winnerCard: { padding: 30, borderRadius: 20, marginBottom: 25, borderWidth: 2 },
    agentWinCard: { backgroundColor: "#00ff88" + "15", borderColor: "#00ff88" },
    spyWinCard: { backgroundColor: "#ff1a1a" + "15", borderColor: "#ff1a1a" },
    winnerText: { fontSize: 24, fontWeight: "900", textAlign: "center", letterSpacing: 3 },
    agentWinText: { color: "#00ff88" },
    spyWinText: { color: "#ff1a1a" },

    revealCard: {
      backgroundColor: colors.surface,
      padding: 30,
      borderRadius: 20,
      alignItems: "center",
      marginBottom: 25,
      borderWidth: 2,
      borderColor: "#000",
      width: "100%",
    },
    revealTitle: { color: isDarkMode ? "#fff" : "#000", fontSize: 13, marginBottom: 10, letterSpacing: 2 },
    revealWord: { color: isDarkMode ? "#fff" : "#000", fontSize: 32, fontWeight: "800", marginBottom: 20 },
    spiesTitle: { color: isDarkMode ? "#fff" : "#000", fontSize: 13, marginBottom: 10, letterSpacing: 2 },
    spyName: { color: "#ff1a1a", fontSize: 18, fontWeight: "700" },

    resultButtons: { flexDirection: "row", gap: 15 },
    resultButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: "#000",
    },
    homeButton: { backgroundColor: colors.surface, borderWidth: 2, borderColor: "#000" },
    resultButtonText: {
      color: isDarkMode ? "#fff" : "#000",
      fontWeight: "800",
      fontSize: 14,
      letterSpacing: 2,
    },
  });