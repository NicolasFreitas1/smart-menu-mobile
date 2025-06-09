import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
  showAll?: boolean;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
  showAll = false,
}: CategoryFilterProps) {
  const containerStyle = showAll
    ? styles.containerShowAll
    : styles.container;

  const wrapperStyle = showAll ? null : styles.wrapper;

  return (
    <View style={wrapperStyle}>
      {showAll ? (
        <View style={containerStyle}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => onSelect(category)}
              style={[
                styles.button,
                selected === category
                  ? styles.buttonSelected
                  : styles.buttonUnselected,
              ]}
            >
              <Text
                style={
                  selected === category
                    ? styles.textSelected
                    : styles.textUnselected
                }
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={containerStyle}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => onSelect(category)}
              style={[
                styles.button,
                selected === category
                  ? styles.buttonSelected
                  : styles.buttonUnselected,
              ]}
            >
              <Text
                style={
                  selected === category
                    ? styles.textSelected
                    : styles.textUnselected
                }
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  container: {
    flexDirection: "row",
    gap: 8, // gap não é suportado diretamente no RN, substituí por margin no botão
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: "100%",
  },
  containerShowAll: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8, // mesmo esquema
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: "center",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 8, // substitui gap horizontal entre botões
    marginBottom: 8, // para o wrap
  },
  buttonSelected: {
    backgroundColor: "#16a34a", // green-600
    borderColor: "#16a34a",
  },
  buttonUnselected: {
    backgroundColor: "#fff",
    borderColor: "#d1d5db", // gray-300
  },
  textSelected: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  textUnselected: {
    color: "#374151", // gray-700
    fontSize: 14,
    fontWeight: "500",
  },
});
