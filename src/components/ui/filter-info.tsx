import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useGlobalStyles } from "../../theme/hooks";
import Icon from "react-native-vector-icons/Feather";

interface FilterInfoProps {
  totalItems: number;
  currentPage: number;
  lastPage: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  selectedCategory?: string;
}

export function FilterInfo({
  totalItems,
  currentPage,
  lastPage,
  hasActiveFilters,
  onResetFilters,
  selectedCategory,
}: FilterInfoProps) {
  const styles = useGlobalStyles();

  if (!hasActiveFilters) {
    return (
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <Text style={styles.mutedText}>{totalItems} pratos encontrados</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.mutedText}>
          {totalItems} pratos encontrados
          {selectedCategory && selectedCategory !== "Todas" && (
            <Text style={styles.text}> em "{selectedCategory}"</Text>
          )}
          {lastPage > 1 && (
            <Text style={styles.mutedText}>
              {" "}
              • Página {currentPage} de {lastPage}
            </Text>
          )}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onResetFilters}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4,
        }}
      >
        <Icon name="x" size={14} color={styles.mutedText.color} />
        <Text style={[styles.mutedText, { fontSize: 12 }]}>Limpar filtros</Text>
      </TouchableOpacity>
    </View>
  );
}
