import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGlobalStyles } from "../../theme/hooks";
import { CategoryFilter } from "../ui/category-filter";
import { FilterInfo } from "../ui/filter-info";

interface MenuHeaderProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  dishesCount: number;
  hasActiveFilters: boolean | undefined;
  onResetFilters: () => void;
}

export function MenuHeader({
  categories,
  selectedCategory,
  onCategoryChange,
  dishesCount,
  hasActiveFilters,
  onResetFilters,
}: MenuHeaderProps) {
  const globalStyles = useGlobalStyles();

  return (
    <View style={localStyles.header}>
      <View style={localStyles.titleSection}>
        <Text style={[globalStyles.title, localStyles.title]}>Cardápio</Text>
        <Text style={[globalStyles.mutedText, localStyles.subtitle]}>
          Explore os pratos disponíveis no cardápio do restaurante. Escolha seus
          favoritos e adicione ao carrinho para fazer seu pedido.
        </Text>
      </View>

      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={onCategoryChange}
      />
      <FilterInfo
        totalItems={dishesCount}
        currentPage={1}
        lastPage={1}
        hasActiveFilters={hasActiveFilters || false}
        onResetFilters={onResetFilters}
        selectedCategory={selectedCategory}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 16,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    lineHeight: 20,
    textAlign: "center",
  },
});
