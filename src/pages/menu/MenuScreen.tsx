import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useGlobalStyles } from "../../theme/hooks";
import { useTheme } from "../../theme/theme-provider";
import { SafeContainer } from "../../components/ui/safe-container";
import { Dish } from "../../domain/dish";
import { DishItem } from "../../components/dish-item";
import { MenuHeader } from "../../components/menu/menu-header";
import { useMenu } from "../../hooks/use-menu";

export function MenuScreen() {
  const globalStyles = useGlobalStyles();
  const { colors } = useTheme();
  const {
    dishes,
    categories,
    isLoading,
    error,
    selectedCategory,
    dishesCount,
    hasActiveFilters,
    refreshData,
    handleCategoryChange,
    resetFilters,
  } = useMenu();

  // Renderizar item do prato
  const renderDishItem = ({ item }: { item: Dish }) => (
    <DishItem
      id={item.id}
      name={item.name}
      description={item.description}
      price={item.price}
    />
  );

  // Renderizar cabeçalho da lista
  const renderHeader = () => (
    <MenuHeader
      categories={categories.map((cat) => cat.name)}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      dishesCount={dishesCount}
      hasActiveFilters={hasActiveFilters}
      onResetFilters={resetFilters}
    />
  );

  if (isLoading && dishes.length === 0) {
    return (
      <SafeContainer style={localStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeContainer>
    );
  }

  if (error && dishes.length === 0) {
    return (
      <SafeContainer style={localStyles.errorContainer}>
        <MenuHeader
          categories={categories.map((cat) => cat.name)}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          dishesCount={0}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetFilters}
        />
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <FlatList
        data={dishes}
        renderItem={renderDishItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={localStyles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeContainer>
  );
}

const localStyles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 100,
  },
});
