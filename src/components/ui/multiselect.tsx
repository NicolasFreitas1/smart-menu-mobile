import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { X } from "lucide-react-native"; // ou use react-native-vector-icons, se disponível

interface MultiSelectProps {
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  options: string[];
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  value,
  onChange,
  placeholder = "Selecione ou crie uma categoria",
  options,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const addItem = (item: string) => {
    const trimmed = item.trim();
    if (trimmed.length === 0 || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setInputValue("");
    setShowOptions(false);
  };

  const removeItem = (item: string) => {
    onChange(value.filter((v) => v !== item));
  };

  // Filtra opções para mostrar só as que não estão selecionadas
  const filteredOptions = options.filter((opt) => !value.includes(opt) && opt.toLowerCase().includes(inputValue.toLowerCase()));

  return (
    <View style={styles.container}>
      <View style={styles.chipsContainer}>
        {value.map((item) => (
          <View key={item} style={styles.chip}>
            <Text style={styles.chipText}>{item}</Text>
            <TouchableOpacity onPress={() => removeItem(item)} style={styles.chipButton}>
              <X width={12} height={12} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TextInput
        style={styles.input}
        value={inputValue}
        onChangeText={setInputValue}
        placeholder={placeholder}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setShowOptions(false)}
        onSubmitEditing={() => addItem(inputValue)}
        blurOnSubmit={false}
      />
      {showOptions && filteredOptions.length > 0 && (
        <View style={styles.optionsContainer}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={filteredOptions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.option} onPress={() => addItem(item)}>
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    padding: 8,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    backgroundColor: "#3b82f6", // azul primário
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 4,
  },
  chipText: {
    color: "#fff",
    marginRight: 4,
    fontSize: 14,
  },
  chipButton: {
    padding: 2,
  },
  input: {
    height: 36,
    fontSize: 16,
    paddingHorizontal: 8,
    color: "#000",
  },
  optionsContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 4,
    maxHeight: 120,
    borderRadius: 8,
    backgroundColor: "#fff",
    zIndex: 1000,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
