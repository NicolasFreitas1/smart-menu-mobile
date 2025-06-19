import { Text, ScrollView, TouchableOpacity } from "react-native";

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap: 8,
        alignItems: "center",
        height: 40,
      }}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => onSelect(category)}
          style={{
            paddingHorizontal: 8,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: selected === category ? "#4A5568" : "#E2E8F0",
            height: 32,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: selected === category ? "#FFFFFF" : "#2D3748",
              fontWeight: "500",
            }}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
