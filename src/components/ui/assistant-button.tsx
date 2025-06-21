import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useGlobalStyles } from "../../theme/hooks";

interface AssistantButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function AssistantButton({
  label,
  onPress,
  disabled = false,
}: AssistantButtonProps) {
  const styles = useGlobalStyles();

  return (
    <TouchableOpacity
      style={[
        localStyles.button,
        styles.buttonPrimary,
        disabled && localStyles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[localStyles.buttonText, styles.buttonText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const localStyles = StyleSheet.create({
  button: {
    minWidth: 120,
    marginHorizontal: 6,
    marginVertical: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});
