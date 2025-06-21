import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  TextStyle,
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
  const allCategories = ["Todas", ...categories];

  const getButtonStyle = (isSelected: boolean) => ({
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: isSelected ? "#48BB78" : "#E2E8F0",
    backgroundColor: isSelected ? "#48BB78" : "#FFFFFF",
  });

  const getTextStyle = (isSelected: boolean): TextStyle => ({
    color: isSelected ? "#FFFFFF" : "#2D3748",
    fontWeight: "500" as const,
    fontSize: 14,
  });

  if (showAll) {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          marginHorizontal: 4,
        }}
      >
        {allCategories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => onSelect(category)}
            style={[
              getButtonStyle(selected === category),
              { marginHorizontal: 4, marginVertical: 4 },
            ]}
          >
            <Text style={getTextStyle(selected === category)}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        marginHorizontal: 4,
        alignItems: "center",
        height: 40,
      }}
    >
      {allCategories.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => onSelect(category)}
          style={[
            getButtonStyle(selected === category),
            { marginHorizontal: 4 },
          ]}
        >
          <Text style={getTextStyle(selected === category)}>{category}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
