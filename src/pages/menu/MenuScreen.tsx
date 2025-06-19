import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useGlobalStyles } from "../../theme/hooks";
import { useRestaurant } from "../../context/RestaurantContext";
import { Dish } from "../../domain/dish";
import { CategoryFilter } from "../../components/ui/category-filter";
import { DishItem } from "../../components/dish-item";
import { SafeContainer } from "../../components/ui/safe-container";
import { FilterInfo } from "../../components/ui/filter-info";
import { getCategories, getRestaurantDishes } from "../../services/restaurant";
import { useMenuFilters } from "../../hooks/use-menu-filters";

interface DataWithPagination<T> {
  data: T[];
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
}

export function MenuScreen() {
  const styles = useGlobalStyles();
  const { restaurantId } = useRestaurant();
  const { filters, setCategoryFilter, hasActiveFilters, resetFilters } =
    useMenuFilters();

  const [dishes, setDishes] = useState<DataWithPagination<Dish> | undefined>(
    undefined
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDishes = useCallback(async () => {
    if (!restaurantId) {
      console.log("No restaurantId, skipping fetch");
      return;
    }

    console.log(
      "🔄 Fetching dishes with filters:",
      JSON.stringify(filters, null, 2)
    );
    setIsLoading(true);

    try {
      const params = {
        restaurantId,
        categoryFilter: filters.categoryFilter,
        page: filters.page,
        per_page: filters.perPage,
      };

      console.log("📡 API params:", JSON.stringify(params, null, 2));

      const response = await getRestaurantDishes(params);

      console.log("✅ Dishes response:", {
        total: response.total,
        currentPage: response.currentPage,
        lastPage: response.lastPage,
        dataLength: response.data.length,
      });

      setDishes(response);
    } catch (error) {
      console.error("❌ Error fetching dishes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId, filters]);

  const fetchCategories = useCallback(async () => {
    try {
      console.log("🔄 Fetching categories...");
      const result = await getCategories();
      const names = result.map((cat) => cat.name);
      setCategories(names);
      console.log("✅ Categories loaded:", names);
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    console.log("🏁 Initial load - fetching categories");
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    console.log("🔄 Filters changed, fetching dishes...");
    fetchDishes();
  }, [fetchDishes]);

  const handleCategorySelect = useCallback(
    (category: string) => {
      console.log("🎯 Category selected:", category);
      setCategoryFilter(category);
    },
    [setCategoryFilter]
  );

  const selectedCategory = filters.categoryFilter || "Todas";

  console.log("📊 Current state:", {
    selectedCategory,
    hasActiveFilters,
    dishesCount: dishes?.data.length || 0,
    isLoading,
  });

  if (isLoading) {
    return (
      <SafeContainer style={{ justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <View style={{ paddingTop: 16 }}>
        <View
          style={{
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 16,
            marginBottom: 24,
          }}
        >
          <Text style={[styles.text, { fontSize: 24, fontWeight: "700" }]}>
            Cardápio
          </Text>
          <Text style={[styles.mutedText, { textAlign: "center" }]}>
            Explore os pratos disponíveis no cardápio do restaurante. Escolha
            seus favoritos e adicione ao carrinho para fazer seu pedido.
          </Text>
        </View>

        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={handleCategorySelect}
        />

        {dishes && (
          <FilterInfo
            totalItems={dishes.total}
            currentPage={dishes.currentPage}
            lastPage={dishes.lastPage}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={resetFilters}
            selectedCategory={selectedCategory}
          />
        )}
      </View>

      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ paddingTop: 8 }}
      >
        <View style={{ gap: 16, padding: 16, paddingTop: 8 }}>
          {dishes?.data.map((dish) => (
            <DishItem
              key={dish.id}
              id={dish.id}
              name={dish.name}
              description={dish.description}
              price={dish.price}
            />
          ))}
        </View>
      </ScrollView>
    </SafeContainer>
  );
}
