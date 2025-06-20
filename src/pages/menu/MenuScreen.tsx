import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useGlobalStyles } from "../../theme/hooks";
import { Dish } from "../../domain/dish";
import { Category } from "../../domain/category";
import { DishItem } from "../../components/dish-item";
import { CategoryFilter } from "../../components/ui/category-filter";
import { FilterInfo } from "../../components/ui/filter-info";
import { useMenuFilters } from "../../hooks/use-menu-filters";
import { useRestaurant } from "../../context/RestaurantContext";
import { restaurantService } from "../../services/restaurant";

interface MenuScreenState {
  dishes: Dish[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: string;
  dishesCount: number;
  hasActiveFilters: boolean | undefined;
}

export function MenuScreen() {
  const globalStyles = useGlobalStyles();
  const { restaurant } = useRestaurant();
  const { filters, updateFilters, resetFilters } = useMenuFilters();
  const [state, setState] = useState<MenuScreenState>({
    dishes: [],
    categories: [],
    isLoading: true,
    error: null,
    selectedCategory: "Todas",
    dishesCount: 0,
    hasActiveFilters: undefined,
  });

  // Log do estado do restaurante
  console.log("🏪 Restaurant state:", {
    restaurant: restaurant?.id,
    restaurantName: restaurant?.name,
  });

  // Carregar categorias
  const fetchCategories = async () => {
    try {
      console.log("🔄 Fetching categories...");
      const result = await restaurantService.getCategories();
      setState((prev) => ({
        ...prev,
        categories: result,
        error: null,
      }));
      console.log("✅ Categories loaded:", result.length);
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      setState((prev) => ({
        ...prev,
        error: "Erro ao carregar categorias",
        isLoading: false,
      }));
    }
  };

  // Carregar pratos
  const fetchDishes = async () => {
    if (!restaurant) {
      console.log("⚠️ No restaurant found, setting loading to false");
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Restaurante não encontrado",
      }));
      return;
    }

    try {
      console.log("🔄 Fetching dishes with filters:", filters);
      console.log("🏪 Restaurant ID:", restaurant.id);

      const params = {
        restaurantId: restaurant.id,
      };
      console.log("📡 API params:", params);

      const dishes = await restaurantService.getDishes(restaurant.id, filters);
      console.log("🍽️ Received dishes:", dishes.length, "dishes");

      setState((prev) => ({
        ...prev,
        dishes,
        dishesCount: dishes.length,
        isLoading: false,
        error: null,
      }));

      console.log("✅ Dishes loaded:", dishes.length);
      console.log("📊 Updated state dishes count:", dishes.length);
    } catch (error) {
      console.error("❌ Error fetching dishes:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Erro ao carregar pratos",
      }));
    }
  };

  // Carregar dados iniciais
  const loadInitialData = async () => {
    console.log("🏁 Initial load - fetching categories");
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await fetchCategories();
      await fetchDishes();
    } catch (error) {
      console.error("❌ Error in loadInitialData:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Erro ao carregar dados iniciais",
      }));
    }
  };

  // Recarregar dados
  const refreshData = async () => {
    await loadInitialData();
  };

  // Mudança de categoria
  const handleCategoryChange = (categoryName: string) => {
    console.log("🎯 Category changed to:", categoryName);
    setState((prev) => ({ ...prev, selectedCategory: categoryName }));

    if (categoryName === "Todas") {
      // Limpar filtros de categoria
      console.log("🗑️ Clearing category filters");
      updateFilters({ selectedCategories: [] });
    } else {
      // Usar o nome da categoria diretamente
      console.log("✅ Updating filters with category name:", categoryName);
      updateFilters({ selectedCategories: [categoryName] });
    }
  };

  // Efeito para carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  // Efeito para recarregar pratos quando filtros mudarem
  useEffect(() => {
    console.log("🔄 useEffect triggered - filters changed");
    console.log("📊 Current filters:", filters);
    console.log("🔄 isLoading state:", state.isLoading);

    if (!state.isLoading) {
      console.log("🔄 Filters changed, fetching dishes...");
      fetchDishes();
    } else {
      console.log("⏳ Skipping fetchDishes because isLoading is true");
    }
  }, [filters.selectedCategories, filters.priceRange, filters.sortBy]);

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
    <View style={styles.header}>
      <View style={styles.titleSection}>
        <Text style={[globalStyles.title, styles.title]}>Cardápio</Text>
        <Text style={[globalStyles.mutedText, styles.subtitle]}>
          Explore os pratos disponíveis no cardápio do restaurante. Escolha seus
          favoritos e adicione ao carrinho para fazer seu pedido.
        </Text>
      </View>

      <CategoryFilter
        categories={state.categories.map((cat) => cat.name)}
        selected={state.selectedCategory}
        onSelect={handleCategoryChange}
      />
      <FilterInfo
        totalItems={state.dishesCount}
        currentPage={1}
        lastPage={1}
        hasActiveFilters={state.hasActiveFilters || false}
        onResetFilters={resetFilters}
        selectedCategory={state.selectedCategory}
      />
    </View>
  );

  // Renderizar estado de carregamento
  if (state.isLoading) {
    return (
      <View
        style={[globalStyles.screenContainer, { justifyContent: "center" }]}
      >
        <ActivityIndicator size="large" />
        <Text
          style={[globalStyles.text, { textAlign: "center", marginTop: 16 }]}
        >
          Carregando menu...
        </Text>
      </View>
    );
  }

  // Renderizar estado de erro
  if (state.error) {
    return (
      <View
        style={[globalStyles.screenContainer, { justifyContent: "center" }]}
      >
        <Text
          style={[globalStyles.text, { textAlign: "center", color: "red" }]}
        >
          {state.error}
        </Text>
        <Text
          style={[
            globalStyles.text,
            {
              textAlign: "center",
              marginTop: 8,
              textDecorationLine: "underline",
            },
          ]}
          onPress={refreshData}
        >
          Tentar novamente
        </Text>
      </View>
    );
  }

  // Log do estado atual
  console.log("📊 Current state:", {
    dishesCount: state.dishesCount,
    hasActiveFilters: state.hasActiveFilters,
    isLoading: state.isLoading,
    selectedCategory: state.selectedCategory,
  });

  return (
    <View style={globalStyles.screenContainer}>
      <FlatList
        data={state.dishes}
        renderItem={renderDishItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={state.isLoading}
            onRefresh={refreshData}
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  separator: {
    height: 16,
  },
  titleSection: {
    marginBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 20,
  },
});
