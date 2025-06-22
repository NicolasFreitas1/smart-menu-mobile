import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGlobalStyles } from "../../theme/hooks";

export function CartHeader() {
  const styles = useGlobalStyles();

  return (
    <View style={localStyles.header}>
      <Text style={[styles.title, localStyles.cartTitle]}>Seu Carrinho</Text>
      <Text style={[styles.mutedText, localStyles.cartSubtitle]}>
        Revise seus itens selecionados antes de finalizar o pedido
      </Text>
    </View>
  );
}

const localStyles = StyleSheet.create({
  header: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  cartTitle: {
    marginBottom: 8,
    textAlign: "center",
  },
  cartSubtitle: {
    lineHeight: 20,
    textAlign: "center",
  },
});
