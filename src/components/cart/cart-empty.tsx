import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGlobalStyles } from "../../theme/hooks";
import { SafeContainer } from "../ui/safe-container";

export function CartEmpty() {
  const styles = useGlobalStyles();

  return (
    <SafeContainer style={localStyles.emptyContainer}>
      <View style={localStyles.emptyContent}>
        <Text style={[styles.title, localStyles.emptyTitle]}>
          Seu carrinho está vazio
        </Text>
        <Text style={[styles.mutedText, localStyles.emptySubtitle]}>
          Adicione pratos para vê-los aqui.
        </Text>
      </View>
    </SafeContainer>
  );
}

const localStyles = StyleSheet.create({
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContent: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    textAlign: "center",
    lineHeight: 20,
  },
});
