import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function RevealResultScreen({ route, navigation }) {
  const {
    players = [],
    language = "en",
    categoryName = null,
    word = null,
    spyIndex = null,
    imposterIndices = [],
  } = route.params || {};

  const imposterNames =
    Array.isArray(imposterIndices) && imposterIndices.length
      ? imposterIndices.map((i) => players[i]).filter(Boolean)
      : Number.isInteger(spyIndex)
        ? [players[spyIndex]].filter(Boolean)
        : [];

  const t = useMemo(() => {
    const EN = {
      title: "Reveal",
      category: "Category:",
      word: "Word:",
      spy: "Imposter:",
      back: "Back",
    };
    const LT = {
      title: "Atskleidimas",
      category: "Kategorija:",
      word: "Žodis:",
      spy: "Apsimetėlis:",
      back: "Atgal",
    };
    return language === "lt" ? LT : EN;
  }, [language]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.title}</Text>

      <View style={styles.card}>
        <Text style={styles.row}>
          <Text style={styles.label}>{t.category} </Text>
          <Text style={styles.value}>{categoryName || "-"}</Text>
        </Text>

        <Text style={styles.row}>
          <Text style={styles.label}>{t.word} </Text>
          <Text style={styles.value}>{word || "-"}</Text>
        </Text>

        <Text style={styles.row}>
          <Text style={styles.label}>{t.spy} </Text>
          <Text style={styles.value}>{imposterNames.length ? imposterNames.join(", ") : "-"}</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.primaryBtnText}>{t.back}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F3F3", padding: 20, paddingTop: 70 },
  title: { fontSize: 28, fontWeight: "900", marginBottom: 16, color: "#111" },
  card: { backgroundColor: "#FFF", borderRadius: 18, padding: 18, marginBottom: 24 },
  row: { fontSize: 18, marginBottom: 10 },
  label: { fontWeight: "800", color: "#333" },
  value: { fontWeight: "900", color: "#111" },
  primaryBtn: { backgroundColor: "#111", borderRadius: 999, paddingVertical: 16, alignItems: "center" },
  primaryBtnText: { color: "#FFF", fontSize: 16, fontWeight: "900" },
});