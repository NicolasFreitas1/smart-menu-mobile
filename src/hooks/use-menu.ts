import { useState, useEffect, useCallback } from "react";
import { Dish } from "../domain/dish";
import { Category } from "../domain/category";
import { useMenuFilters } from "./use-menu-filters";
import { useRestaurant } from "../context/RestaurantContext";
import { restaurantService } from "../services/restaurant";
import { MESSAGES, FILTERS } from "../config/constants";

interface MenuState {
  dishes: Dish[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: string;
  dishesCount: number;
  hasActiveFilters: boolean | undefined;
}

export function useMenu() {
  const { restaurant } = useRestaurant();
  const { filters, updateFilters, resetFilters } = useMenuFilters();
  
  const [state, setState] = useState<MenuState>({
    dishes: [],
    categories: [],
    isLoading: true,
    error: null,
    selectedCategory: FILTERS.DEFAULT_CATEGORY,
    dishesCount: 0,
    hasActiveFilters: undefined,
  });

  // Carregar categorias
  const fetchCategories = useCallback(async () => {
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
        error: MESSAGES.ERROR.FETCH_CATEGORIES,
        isLoading: false,
      }));
    }
  }, []);

  // Carregar pratos
  const fetchDishes = useCallback(async () => {
    if (!restaurant) {
      console.log("⚠️ No restaurant found, setting loading to false");
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: MESSAGES.ERROR.RESTAURANT_NOT_FOUND,
      }));
      return;
    }

    try {
      console.log("🔄 Fetching dishes with filters:", filters);
      console.log("🏪 Restaurant ID:", restaurant.id);

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
    } catch (error) {
      console.error("❌ Error fetching dishes:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: MESSAGES.ERROR.FETCH_DISHES,
      }));
    }
  }, [restaurant, filters]);

  // Carregar dados iniciais
  const loadInitialData = useCallback(async () => {
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
        error: MESSAGES.ERROR.INITIAL_LOAD,
      }));
    }
  }, [fetchCategories, fetchDishes]);

  // Recarregar dados
  const refreshData = useCallback(async () => {
    await loadInitialData();
  }, [loadInitialData]);

  // Mudança de categoria
  const handleCategoryChange = useCallback((categoryName: string) => {
    console.log("🎯 Category changed to:", categoryName);
    setState((prev) => ({ ...prev, selectedCategory: categoryName }));

    if (categoryName === FILTERS.DEFAULT_CATEGORY) {
      console.log("🗑️ Clearing category filters");
      updateFilters({ selectedCategories: [] });
    } else {
      console.log("✅ Updating filters with category name:", categoryName);
      updateFilters({ selectedCategories: [categoryName] });
    }
  }, [updateFilters]);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

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
  }, [filters.selectedCategories, filters.priceRange, filters.sortBy, state.isLoading, fetchDishes]);

  return {
    // State
    ...state,
    
    // Actions
    refreshData,
    handleCategoryChange,
    resetFilters,
  };
} 