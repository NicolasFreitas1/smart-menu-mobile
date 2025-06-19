import { useState, useCallback, useMemo } from "react";

interface MenuFilters {
  categoryFilter?: string;
  page: number;
  perPage: number;
}

interface UseMenuFiltersReturn {
  filters: MenuFilters;
  setCategoryFilter: (category: string) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

const DEFAULT_FILTERS: MenuFilters = {
  categoryFilter: undefined,
  page: 1,
  perPage: 9999,
};

export function useMenuFilters(): UseMenuFiltersReturn {
  const [filters, setFilters] = useState<MenuFilters>(DEFAULT_FILTERS);

  const setCategoryFilter = useCallback((category: string) => {
    console.log("Setting category filter:", category);
    setFilters((prev) => ({
      ...prev,
      categoryFilter: category === "Todas" ? undefined : category,
      page: 1, // Reset para primeira página quando mudar categoria
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const setPerPage = useCallback((perPage: number) => {
    setFilters((prev) => ({
      ...prev,
      perPage,
      page: 1, // Reset para primeira página quando mudar perPage
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return filters.categoryFilter !== undefined || filters.page !== 1;
  }, [filters]);

  console.log("Current filters:", filters);

  return {
    filters,
    setCategoryFilter,
    setPage,
    setPerPage,
    resetFilters,
    hasActiveFilters,
  };
}
