import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { useTheme } from "../../theme/theme-provider";
import Feather from "react-native-vector-icons/Feather";

interface SimpleDateTimeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  mode: "date" | "time";
}

export function SimpleDateTimeInput({
  value,
  onChange,
  placeholder,
  mode,
}: SimpleDateTimeInputProps) {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handlePress = () => {
    setIsEditing(true);
    setTempValue(value);
  };

  const handleConfirm = () => {
    if (validateInput(tempValue, mode)) {
      onChange(tempValue);
      setIsEditing(false);
    } else {
      Alert.alert(
        "Formato Inválido",
        mode === "date"
          ? "Use o formato DD/MM/AAAA (ex: 25/12/2024)"
          : "Use o formato HH:MM (ex: 14:30)"
      );
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempValue(value);
  };

  const validateInput = (
    input: string,
    inputMode: "date" | "time"
  ): boolean => {
    if (!input.trim()) return false;

    if (inputMode === "date") {
      // Validar formato DD/MM/AAAA
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = input.match(dateRegex);

      if (!match) return false;

      const [, day, month, year] = match;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      // Verificar se é uma data válida
      if (
        date.getFullYear() !== parseInt(year) ||
        date.getMonth() !== parseInt(month) - 1 ||
        date.getDate() !== parseInt(day)
      ) {
        return false;
      }

      // Verificar se não é uma data passada
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    } else {
      // Validar formato HH:MM
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      return timeRegex.test(input);
    }
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;
    return value;
  };

  const getIcon = () => {
    return mode === "date" ? "calendar" : "clock";
  };

  if (isEditing) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.input,
            {
              backgroundColor: colors.input,
              borderColor: colors.primary,
            },
          ]}
        >
          <Feather name={getIcon()} size={20} color={colors.primary} />
          <TextInput
            style={[
              styles.textInput,
              {
                color: colors.foreground,
              },
            ]}
            value={tempValue}
            onChangeText={setTempValue}
            placeholder={placeholder}
            placeholderTextColor={colors.mutedForeground}
            keyboardType="numeric"
            maxLength={mode === "date" ? 10 : 5}
            autoFocus
          />
        </View>
        <View style={styles.editActions}>
          <TouchableOpacity
            onPress={handleCancel}
            style={[styles.actionButton, { backgroundColor: colors.secondary }]}
          >
            <Text
              style={[styles.actionText, { color: colors.secondaryForeground }]}
            >
              Cancelar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleConfirm}
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
          >
            <Text
              style={[styles.actionText, { color: colors.primaryForeground }]}
            >
              Confirmar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.input,
        {
          backgroundColor: colors.input,
          borderColor: colors.border,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Feather
        name={getIcon()}
        size={20}
        color={value ? colors.foreground : colors.mutedForeground}
      />
      <Text
        style={[
          styles.text,
          {
            color: value ? colors.foreground : colors.mutedForeground,
          },
        ]}
      >
        {getDisplayValue()}
      </Text>
      <Feather name="edit-2" size={16} color={colors.mutedForeground} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
  },
  text: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  editActions: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
