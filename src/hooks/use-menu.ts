import { useState, useEffect, useCallback } from "react";
import { Dish } from "../domain/dish";
import { Category } from "../domain/category";
import { useMenuFilters } from "./use-menu-filters";
import { useRestaurant } from "../context/RestaurantContext";
import { restaurantService } from "../services/restaurant";
import { MESSAGES, FILTERS } from "../config/constants";
import { logger } from "../utils/logger";

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
      logger.info("🔄 Buscando categorias...");
      const result = await restaurantService.getCategories();
      setState((prev) => ({
        ...prev,
        categories: result,
        error: null,
      }));
      logger.success(`✅ Categorias carregadas: ${result.length}`);
    } catch (error) {
      logger.error("❌ Erro ao buscar categorias:", error);
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
      logger.warning("⚠️ Nenhum restaurante encontrado, definindo loading como false");
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: MESSAGES.ERROR.RESTAURANT_NOT_FOUND,
      }));
      return;
    }

    if (!restaurant.id) {
      logger.error("❌ Restaurante sem ID válido:", restaurant);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Restaurante sem ID válido",
      }));
      return;
    }

    try {
      logger.info(`🔄 Buscando pratos com filtros:`, filters);
      logger.info(`🏪 Restaurant ID: ${restaurant.id}`);

      const dishes = await restaurantService.getDishes(restaurant.id, filters);
      logger.success(`🍽️ Pratos recebidos: ${dishes.length} pratos`);

      setState((prev) => ({
        ...prev,
        dishes,
        dishesCount: dishes.length,
        isLoading: false,
        error: null,
      }));

      logger.success(`✅ Pratos carregados: ${dishes.length}`);
    } catch (error) {
      logger.error("❌ Erro ao buscar pratos:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: MESSAGES.ERROR.FETCH_DISHES,
      }));
    }
  }, [restaurant, filters]);

  // Carregar dados iniciais
  const loadInitialData = useCallback(async () => {
    logger.info("🏁 Carregamento inicial - buscando categorias");
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await fetchCategories();
      await fetchDishes();
    } catch (error) {
      logger.error("❌ Erro no carregamento inicial:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: MESSAGES.ERROR.INITIAL_LOAD,
      }));
    }
  }, [fetchCategories, fetchDishes]);

  // Recarregar dados
  const refreshData = useCallback(async () => {
    logger.info("🔄 Recarregando dados do menu...");
    await loadInitialData();
  }, [loadInitialData]);

  // Mudança de categoria
  const handleCategoryChange = useCallback((categoryName: string) => {
    logger.info(`🎯 Categoria alterada para: ${categoryName}`);
    setState((prev) => ({ ...prev, selectedCategory: categoryName }));

    if (categoryName === FILTERS.DEFAULT_CATEGORY) {
      logger.info("🗑️ Limpando filtros de categoria");
      updateFilters({ selectedCategories: [] });
    } else {
      logger.info(`✅ Atualizando filtros com nome da categoria: ${categoryName}`);
      updateFilters({ selectedCategories: [categoryName] });
    }
  }, [updateFilters]);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Efeito para recarregar pratos quando filtros mudarem
  useEffect(() => {
    logger.info("🔄 useEffect disparado - filtros alterados");
    logger.info(`📊 Filtros atuais:`, filters);
    logger.info(`🔄 Estado isLoading: ${state.isLoading}`);

    if (!state.isLoading) {
      logger.info("🔄 Filtros alterados, buscando pratos...");
      fetchDishes();
    } else {
      logger.info("⏳ Pulando fetchDishes porque isLoading é true");
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