import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from "react-native";
import { useTheme } from "../../theme/theme-provider";
import Feather from "react-native-vector-icons/Feather";

// Importar a versão simples como fallback
import { SimpleDateTimeInput } from "./simple-date-time-input";

interface DateTimeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  mode: "date" | "time";
  minimumDate?: Date;
  maximumDate?: Date;
  useSimpleVersion?: boolean; // Flag para usar versão simples
}

export function DateTimeInput({
  value,
  onChange,
  placeholder,
  mode,
  minimumDate,
  maximumDate,
  useSimpleVersion = false, // Por padrão, usar versão simples
}: DateTimeInputProps) {
  // Se a flag estiver ativa, usar a versão simples
  if (useSimpleVersion) {
    return (
      <SimpleDateTimeInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        mode={mode}
      />
    );
  }

  // Tentar usar o DateTimePicker nativo
  try {
    const DateTimePicker =
      require("@react-native-community/datetimepicker").default;

    const { colors } = useTheme();
    const [showPicker, setShowPicker] = useState(false);

    // Converter string para Date para o picker
    const getDateFromValue = (): Date => {
      if (!value) return new Date();

      try {
        if (mode === "date") {
          // Converter DD/MM/AAAA para Date
          const [day, month, year] = value.split("/");
          return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
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
        return new Date();
      }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
      if (Platform.OS === "android") {
        setShowPicker(false);
      }

      if (selectedDate) {
        let formattedValue = "";

        if (mode === "date") {
          // Formato DD/MM/AAAA
          const day = selectedDate.getDate().toString().padStart(2, "0");
          const month = (selectedDate.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const year = selectedDate.getFullYear();
          formattedValue = `${day}/${month}/${year}`;
        } else {
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

    const getDisplayValue = () => {
      if (!value) return placeholder;
      return value;
    };

    const getIcon = () => {
      return mode === "date" ? "calendar" : "clock";
    };

    const renderPicker = () => {
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
                    <Text
                      style={[styles.modalButton, { color: colors.primary }]}
                    >
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={[styles.modalTitle, { color: colors.foreground }]}
                  >
                    {mode === "date" ? "Selecionar Data" : "Selecionar Horário"}
                  </Text>
                  <TouchableOpacity onPress={hidePickerModal}>
                    <Text
                      style={[styles.modalButton, { color: colors.primary }]}
                    >
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
          onPress={showPickerModal}
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
          <Feather
            name="chevron-down"
            size={16}
            color={colors.mutedForeground}
          />
        </TouchableOpacity>

        {renderPicker()}
      </View>
    );
  } catch (error) {
    console.warn(
      "DateTimePicker não disponível, usando versão simples:",
      error
    );
    // Fallback para versão simples
    return (
      <SimpleDateTimeInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        mode={mode}
      />
    );
  }
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
