import React from "react";
import { Text, StyleSheet, TextProps } from "react-native";

interface LabelProps extends TextProps {
  disabled?: boolean;
}

function Label({ style, disabled, children, ...props }: LabelProps) {
  return (
    <Text
      accessibilityRole="label"
      style={[styles.label, disabled && styles.disabled, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14, // text-sm
    fontWeight: "500", // font-medium
    lineHeight: 16,
    color: "#000",
    marginBottom: 4,
    // Flex items-center gap-2 would be done in container, not on label
  },
  disabled: {
    opacity: 0.5,
  },
});

export { Label };
