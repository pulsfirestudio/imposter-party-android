import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const pickRandom = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
};

export default function DiscussionScreen({ route, navigation }) {
  const {
    players = [],
    language = "en",
    categoryId = null,
    categoryName = null,
    word = null,
    spyIndex = null,
    imposterIndices = [],
  } = route.params || {};

  const [starter, setStarter] = useState(null);

  useEffect(() => {
    setStarter(pickRandom(players));
  }, [players]);

  const t = useMemo(() => {
    const EN = {
      title: "Round started!",
      subtitle: "Talk it out. Ask questions. Figure out who’s faking it.",
      starterPrefix: "Starting player:",
      revealBtn: "REVEAL IMPOSTER & WORD",
      newGameBtn: "New Game",
      fallbackStarter: "Someone",
    };

    const LT = {
      title: "Raundas prasidėjo!",
      subtitle: "Diskutuokite. Klauskite. Išsiaiškinkite, kas apsimetinėja.",
      starterPrefix: "Pradeda:",
      revealBtn: "ATSKLEISTI APSIMETĖLĮ IR ŽODĮ",
      newGameBtn: "Naujas žaidimas",
      fallbackStarter: "Kažkas",
    };

    return language === "lt" ? LT : EN;
  }, [language]);

  const onReveal = () => {
    navigation.navigate("RevealResult", {
      players,
      language,
      categoryId,
      categoryName,
      word,
      spyIndex,
      imposterIndices,
    });
  };

  // IMPORTANT:
  // Your GameScreen needs secretWord/imposterIndices passed in.
  // So for now, New Game should safely go back to CreateRoom.
  // (Once you paste CreateRoom "Start Game" generator, we’ll make this jump straight to reveal.)
  const onNewGame = () => {
    navigation.replace("CreateRoom", { language });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        <Text style={styles.starter}>
          <Text style={styles.starterLabel}>{t.starterPrefix} </Text>
          <Text style={styles.starterName}>{starter || t.fallbackStarter}</Text>
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={onReveal}>
          <Text style={styles.primaryBtnText}>{t.revealBtn}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={onNewGame}>
          <Text style={styles.secondaryBtnText}>{t.newGameBtn}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F3F3", padding: 20, justifyContent: "space-between" },
  header: { paddingTop: 60 },
  title: { fontSize: 30, fontWeight: "900", color: "#111", marginBottom: 10 },
  subtitle: { fontSize: 18, color: "#333", lineHeight: 24, marginBottom: 22 },
  starter: { fontSize: 18, marginTop: 6 },
  starterLabel: { color: "#333", fontWeight: "800" },
  starterName: { color: "#111", fontWeight: "900" },
  actions: { paddingBottom: 24 },
  primaryBtn: { backgroundColor: "#111", borderRadius: 999, paddingVertical: 16, alignItems: "center", marginBottom: 12 },
  primaryBtnText: { color: "#FFF", fontSize: 16, fontWeight: "900" },
  secondaryBtn: { alignItems: "center", paddingVertical: 10 },
  secondaryBtnText: { color: "#111", fontSize: 16, fontWeight: "700" },
});