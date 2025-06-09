import * as React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

function Textarea({ style, ...props }: TextInputProps) {
  return (
    <TextInput
      multiline
      placeholderTextColor="#999" // placeholder:text-muted-foreground
      style={[styles.textarea, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc", // similar a border-input
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "transparent", // bg-transparent
    fontSize: 16, // text-base
    minHeight: 64, // min-h-16 = 4rem = 64px
    color: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
});

export { Textarea };
