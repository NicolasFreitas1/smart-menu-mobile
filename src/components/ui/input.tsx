import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  error?: boolean;
}

function Input({ style, error, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, error && styles.error, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 36, // equivalente ao h-9 (~36px)
    borderWidth: 1,
    borderColor: "#ccc", // cor padrão do border-input
    borderRadius: 6, // rounded-md
    paddingHorizontal: 12, // px-3 (12px)
    paddingVertical: 4, // py-1 (4px)
    fontSize: 16, // text-base
    backgroundColor: "transparent",
    color: "#000", // cor padrão do texto
  },
  error: {
    borderColor: "#dc2626", // vermelho, parecido com destructive
  },
});

export { Input };
