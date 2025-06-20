import { useState, useEffect, useCallback } from "react";
import { storageService } from "../services/storage";

export interface MenuFilters {
  selectedCategories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  dietaryRestrictions: string[];
  sortBy: "name" | "price" | "popularity";
  showFavoritesOnly: boolean;
}

const defaultFilters: MenuFilters = {
  selectedCategories: [],
  priceRange: { min: 0, max: 1000 },
  dietaryRestrictions: [],
  sortBy: "name",
  showFavoritesOnly: false,
};

const FILTERS_STORAGE_KEY = "@smart-menu:menu-filters";

export function useMenuFilters() {
  const [filters, setFilters] = useState<MenuFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega filtros salvos ao inicializar
  useEffect(() => {
    loadSavedFilters();
  }, []);

  const loadSavedFilters = async () => {
    try {
      setIsLoading(true);
      const savedFilters = await storageService.getItem<MenuFilters>(
        FILTERS_STORAGE_KEY
      );

      if (savedFilters) {
        setFilters({ ...defaultFilters, ...savedFilters });
      }
    } catch (error) {
      console.error("Erro ao carregar filtros:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Salva filtros no storage
  const saveFilters = useCallback(async (newFilters: MenuFilters) => {
    try {
      await storageService.setItem(FILTERS_STORAGE_KEY, newFilters);
    } catch (error) {
      console.error("Erro ao salvar filtros:", error);
    }
  }, []);

  // Atualiza filtros e salva automaticamente
  const updateFilters = useCallback(
    (updates: Partial<MenuFilters>) => {
      console.log("🔄 updateFilters called with updates:", updates);
      console.log("📊 Current filters before update:", filters);

      const newFilters = { ...filters, ...updates };
      console.log("📊 New filters after update:", newFilters);

      setFilters(newFilters);
      saveFilters(newFilters);
    },
    [filters, saveFilters]
  );

  // Adiciona categoria aos filtros
  const addCategory = useCallback(
    (categoryId: string) => {
      if (!filters.selectedCategories.includes(categoryId)) {
        updateFilters({
          selectedCategories: [...filters.selectedCategories, categoryId],
        });
      }
    },
    [filters.selectedCategories, updateFilters]
  );

  // Remove categoria dos filtros
  const removeCategory = useCallback(
    (categoryId: string) => {
      updateFilters({
        selectedCategories: filters.selectedCategories.filter(
          (id) => id !== categoryId
        ),
      });
    },
    [filters.selectedCategories, updateFilters]
  );

  // Toggle categoria (adiciona se não existe, remove se existe)
  const toggleCategory = useCallback(
    (categoryId: string) => {
      if (filters.selectedCategories.includes(categoryId)) {
        removeCategory(categoryId);
      } else {
        addCategory(categoryId);
      }
    },
    [filters.selectedCategories, addCategory, removeCategory]
  );

  // Atualiza faixa de preço
  const updatePriceRange = useCallback(
    (min: number, max: number) => {
      updateFilters({ priceRange: { min, max } });
    },
    [updateFilters]
  );

  // Adiciona restrição dietética
  const addDietaryRestriction = useCallback(
    (restriction: string) => {
      if (!filters.dietaryRestrictions.includes(restriction)) {
        updateFilters({
          dietaryRestrictions: [...filters.dietaryRestrictions, restriction],
        });
      }
    },
    [filters.dietaryRestrictions, updateFilters]
  );

  // Remove restrição dietética
  const removeDietaryRestriction = useCallback(
    (restriction: string) => {
      updateFilters({
        dietaryRestrictions: filters.dietaryRestrictions.filter(
          (r) => r !== restriction
        ),
      });
    },
    [filters.dietaryRestrictions, updateFilters]
  );

  // Atualiza ordenação
  const setSortBy = useCallback(
    (sortBy: MenuFilters["sortBy"]) => {
      updateFilters({ sortBy });
    },
    [updateFilters]
  );

  // Toggle mostrar apenas favoritos
  const toggleFavoritesOnly = useCallback(() => {
    updateFilters({ showFavoritesOnly: !filters.showFavoritesOnly });
  }, [filters.showFavoritesOnly, updateFilters]);

  // Reseta todos os filtros
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    saveFilters(defaultFilters);
  }, [saveFilters]);

  // Aplica filtros a uma lista de pratos
  const applyFilters = useCallback(
    (dishes: any[]) => {
      let filteredDishes = [...dishes];

      // Filtra por categorias selecionadas
      if (filters.selectedCategories.length > 0) {
        filteredDishes = filteredDishes.filter((dish) =>
          dish.categories?.some((cat: string) =>
            filters.selectedCategories.includes(cat)
          )
        );
      }

      // Filtra por faixa de preço
      filteredDishes = filteredDishes.filter(
        (dish) =>
          dish.price >= filters.priceRange.min &&
          dish.price <= filters.priceRange.max
      );

      // Filtra por restrições dietéticas
      if (filters.dietaryRestrictions.length > 0) {
        filteredDishes = filteredDishes.filter((dish) =>
          filters.dietaryRestrictions.some((restriction) =>
            dish.dietaryInfo?.includes(restriction)
          )
        );
      }

      // Filtra por favoritos (se aplicável)
      if (filters.showFavoritesOnly) {
        // Aqui você pode integrar com o sistema de favoritos do usuário
        // filteredDishes = filteredDishes.filter(dish => dish.isFavorite);
      }

      // Aplica ordenação
      switch (filters.sortBy) {
        case "price":
          filteredDishes.sort((a, b) => a.price - b.price);
          break;
        case "popularity":
          filteredDishes.sort(
            (a, b) => (b.popularity || 0) - (a.popularity || 0)
          );
          break;
        case "name":
        default:
          filteredDishes.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }

      return filteredDishes;
    },
    [filters]
  );

  return {
    filters,
    isLoading,
    updateFilters,
    addCategory,
    removeCategory,
    toggleCategory,
    updatePriceRange,
    addDietaryRestriction,
    removeDietaryRestriction,
    setSortBy,
    toggleFavoritesOnly,
    resetFilters,
    applyFilters,
    loadSavedFilters,
  };
}
