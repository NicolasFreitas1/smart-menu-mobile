import React from "react";
import { View, StyleSheet } from "react-native";
import { AssistantButton } from "../ui/assistant-button";

interface NewSuggestionButtonProps {
  onPress: () => void;
}

export function NewSuggestionButton({ onPress }: NewSuggestionButtonProps) {
  return (
    <View style={localStyles.container}>
      <AssistantButton label="🔄 Nova sugestão" onPress={onPress} />
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 16,
  },
});
