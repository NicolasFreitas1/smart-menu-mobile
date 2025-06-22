import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../../theme/theme-provider";
import Feather from "react-native-vector-icons/Feather";

interface MaskedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  mode: "date" | "time" | "phone";
  minimumDate?: Date;
  maximumDate?: Date;
}

export function MaskedInput({
  value,
  onChange,
  placeholder,
  mode,
  minimumDate,
  maximumDate,
}: MaskedInputProps) {
  const { colors } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  // Aplicar máscara conforme o usuário digita
  const applyMask = (
    text: string,
    inputMode: "date" | "time" | "phone"
  ): string => {
    // Remover todos os caracteres não numéricos
    const numbers = text.replace(/\D/g, "");

    if (inputMode === "date") {
      // Máscara para data: DD/MM/AAAA
      if (numbers.length <= 2) return numbers;
      if (numbers.length <= 4)
        return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(
        4,
        8
      )}`;
    } else if (inputMode === "time") {
      // Máscara para hora: HH:MM
      if (numbers.length <= 2) return numbers;
      return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`;
    } else if (inputMode === "phone") {
      // Máscara para telefone: (XX) XXXXX-XXXX
      if (numbers.length <= 2) return `(${numbers}`;
      if (numbers.length <= 7)
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      if (numbers.length <= 11)
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
          7
        )}`;
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }

    return text;
  };

  const handleTextChange = (text: string) => {
    const maskedText = applyMask(text, mode);
    setTempValue(maskedText);

    // Se o formato estiver completo e válido, salvar automaticamente
    if (validateInput(maskedText, mode)) {
      onChange(maskedText);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    // Quando o usuário sai do input, validar e salvar
    if (validateInput(tempValue, mode)) {
      onChange(tempValue);
    } else if (tempValue.trim() && mode !== "phone") {
      // Se tem valor mas formato está errado, abrir picker (exceto para telefone)
      setShowPicker(true);
    }
    setIsEditing(false);
  };

  const validateInput = (
    input: string,
    inputMode: "date" | "time" | "phone"
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
    } else if (inputMode === "time") {
      // Validar formato HH:MM
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      return timeRegex.test(input);
    } else if (inputMode === "phone") {
      // Validar formato (XX) XXXXX-XXXX
      const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
      return phoneRegex.test(input);
    }

    return false;
  };

  // Converter string para Date para o picker
  const getDateFromValue = (): Date => {
    if (!value) return new Date();

    try {
      if (mode === "date") {
        // Converter DD/MM/AAAA para Date
        const [day, month, year] = value.split("/");
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else if (mode === "time") {
        // Converter HH:MM para Date (usando hoje como base)
        const [hours, minutes] = value.split(":");
        const now = new Date();
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          parseInt(hours),
          parseInt(minutes)
        );
      }
    } catch (error) {
      console.error("Erro ao converter valor para data:", error);
    }

    return new Date();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (selectedDate && mode !== "phone") {
      let formattedValue = "";

      if (mode === "date") {
        // Formato DD/MM/AAAA
        const day = selectedDate.getDate().toString().padStart(2, "0");
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
        const year = selectedDate.getFullYear();
        formattedValue = `${day}/${month}/${year}`;
      } else if (mode === "time") {
        // Formato HH:MM
        const hours = selectedDate.getHours().toString().padStart(2, "0");
        const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
        formattedValue = `${hours}:${minutes}`;
      }

      onChange(formattedValue);
    }
  };

  const showPickerModal = () => {
    setShowPicker(true);
  };

  const hidePickerModal = () => {
    setShowPicker(false);
  };

  const handlePress = () => {
    setIsEditing(true);
    setTempValue(value);
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;
    return value;
  };

  const getIcon = () => {
    return mode === "date" ? "calendar" : mode === "time" ? "clock" : "phone";
  };

  const getMaxLength = () => {
    return mode === "date" ? 10 : mode === "time" ? 5 : 15; // DD/MM/AAAA = 10, HH:MM = 5, (XX) XXXXX-XXXX = 15
  };

  const renderPicker = () => {
    // Não renderizar picker para telefone
    if (mode === "phone") return null;

    if (Platform.OS === "ios") {
      return (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={hidePickerModal}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[styles.modalContent, { backgroundColor: colors.card }]}
            >
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={hidePickerModal}>
                  <Text style={[styles.modalButton, { color: colors.primary }]}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  {mode === "date" ? "Selecionar Data" : "Selecionar Horário"}
                </Text>
                <TouchableOpacity onPress={hidePickerModal}>
                  <Text style={[styles.modalButton, { color: colors.primary }]}>
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={getDateFromValue()}
                mode={mode}
                display="spinner"
                onChange={handleDateChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                style={styles.iosPicker}
              />
            </View>
          </View>
        </Modal>
      );
    } else {
      return showPicker ? (
        <DateTimePicker
          value={getDateFromValue()}
          mode={mode}
          display="default"
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      ) : null;
    }
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
            onChangeText={handleTextChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={colors.mutedForeground}
            keyboardType="numeric"
            maxLength={getMaxLength()}
            autoFocus
            multiline={false}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

      {renderPicker()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 48,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    height: 48,
    backgroundColor: "transparent",
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
    height: 32,
    paddingVertical: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalButton: {
    fontSize: 16,
    fontWeight: "500",
  },
  iosPicker: {
    height: 200,
  },
});
 