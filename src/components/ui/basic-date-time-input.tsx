import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useTheme } from "../../theme/theme-provider";
import Feather from "react-native-vector-icons/Feather";

interface BasicDateTimeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  mode: "date" | "time";
}

export function BasicDateTimeInput({
  value,
  onChange,
  placeholder,
  mode,
}: BasicDateTimeInputProps) {
  const { colors } = useTheme();

  const getIcon = () => {
    return mode === "date" ? "calendar" : "clock";
  };

  const getMaxLength = () => {
    return mode === "date" ? 10 : 5; // DD/MM/AAAA = 10, HH:MM = 5
  };

  return (
    <View
      style={[
        styles.input,
        {
          backgroundColor: colors.input,
          borderColor: colors.border,
        },
      ]}
    >
      <Feather name={getIcon()} size={20} color={colors.mutedForeground} />
      <TextInput
        style={[
          styles.textInput,
          {
            color: colors.foreground,
          },
        ]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        keyboardType="numeric"
        maxLength={getMaxLength()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
});
