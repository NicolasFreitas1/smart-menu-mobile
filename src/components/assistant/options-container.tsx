import React from "react";
import { View, StyleSheet } from "react-native";
import { AssistantButton } from "../ui/assistant-button";
import { Option } from "../../types/assistant";

interface OptionsContainerProps {
  options: Option[];
  onOptionClick: (option: Option) => void;
}

export function OptionsContainer({
  options,
  onOptionClick,
}: OptionsContainerProps) {
  return (
    <View style={localStyles.container}>
      {options.map((option) => (
        <AssistantButton
          key={option.value}
          label={option.label}
          onPress={() => onOptionClick(option)}
        />
      ))}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginHorizontal: 6,
  },
});
