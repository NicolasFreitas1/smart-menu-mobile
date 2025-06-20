import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useTheme } from "../theme/theme-provider";
import { storageService } from "../services/storage";

interface FavoriteButtonProps {
  itemId: string;
  itemType: "dish" | "category" | "restaurant";
  size?: number;
  onToggle?: (isFavorite: boolean) => void;
}

const FAVORITES_STORAGE_KEY = "@smart-menu:favorites";

interface FavoritesData {
  dishes: string[];
  categories: string[];
  restaurants: string[];
}

export function FavoriteButton({
  itemId,
  itemType,
  size = 24,
  onToggle,
}: FavoriteButtonProps) {
  const { colors } = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavoriteStatus();
  }, [itemId, itemType]);

  const loadFavoriteStatus = async () => {
    try {
      setIsLoading(true);
      const favorites = await storageService.getItem<FavoritesData>(
        FAVORITES_STORAGE_KEY
      );

      if (favorites) {
        const itemList = favorites[`${itemType}s` as keyof FavoritesData] || [];
        setIsFavorite(itemList.includes(itemId));
      }
    } catch (error) {
      console.error("Erro ao carregar status de favorito:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favorites = (await storageService.getItem<FavoritesData>(
        FAVORITES_STORAGE_KEY
      )) || {
        dishes: [],
        categories: [],
        restaurants: [],
      };

      const itemListKey = `${itemType}s` as keyof FavoritesData;
      const itemList = favorites[itemListKey] || [];

      let newItemList: string[];
      let newIsFavorite: boolean;

      if (isFavorite) {
        // Remove dos favoritos
        newItemList = itemList.filter((id) => id !== itemId);
        newIsFavorite = false;
      } else {
        // Adiciona aos favoritos
        newItemList = [...itemList, itemId];
        newIsFavorite = true;
      }

      const updatedFavorites = {
        ...favorites,
        [itemListKey]: newItemList,
      };

      await storageService.setItem(FAVORITES_STORAGE_KEY, updatedFavorites);
      setIsFavorite(newIsFavorite);

      // Chama callback se fornecido
      onToggle?.(newIsFavorite);
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
    }
  };

  if (isLoading) {
    return (
      <TouchableOpacity
        style={[styles.button, { width: size, height: size }]}
        disabled
      >
        <Feather
          name="heart"
          size={size * 0.6}
          color={colors.mutedForeground}
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, { width: size, height: size }]}
      onPress={toggleFavorite}
      activeOpacity={0.7}
    >
      <Feather
        name={isFavorite ? "heart" : "heart"}
        size={size * 0.6}
        color={isFavorite ? colors.error : colors.mutedForeground}
        style={isFavorite ? styles.filledHeart : undefined}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  filledHeart: {
    fill: "#EF4444", // Cor de preenchimento para coração cheio
  },
});

// Hook para gerenciar favoritos
export function useFavorites(itemType: "dish" | "category" | "restaurant") {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, [itemType]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const favoritesData = await storageService.getItem<FavoritesData>(
        FAVORITES_STORAGE_KEY
      );

      if (favoritesData) {
        const itemList =
          favoritesData[`${itemType}s` as keyof FavoritesData] || [];
        setFavorites(itemList);
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToFavorites = async (itemId: string) => {
    try {
      const favoritesData = (await storageService.getItem<FavoritesData>(
        FAVORITES_STORAGE_KEY
      )) || {
        dishes: [],
        categories: [],
        restaurants: [],
      };

      const itemListKey = `${itemType}s` as keyof FavoritesData;
      const itemList = favoritesData[itemListKey] || [];

      if (!itemList.includes(itemId)) {
        const newItemList = [...itemList, itemId];
        const updatedFavorites = {
          ...favoritesData,
          [itemListKey]: newItemList,
        };

        await storageService.setItem(FAVORITES_STORAGE_KEY, updatedFavorites);
        setFavorites(newItemList);
      }
    } catch (error) {
      console.error("Erro ao adicionar favorito:", error);
    }
  };

  const removeFromFavorites = async (itemId: string) => {
    try {
      const favoritesData = await storageService.getItem<FavoritesData>(
        FAVORITES_STORAGE_KEY
      );

      if (favoritesData) {
        const itemListKey = `${itemType}s` as keyof FavoritesData;
        const itemList = favoritesData[itemListKey] || [];
        const newItemList = itemList.filter((id) => id !== itemId);

        const updatedFavorites = {
          ...favoritesData,
          [itemListKey]: newItemList,
        };

        await storageService.setItem(FAVORITES_STORAGE_KEY, updatedFavorites);
        setFavorites(newItemList);
      }
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  };

  const isFavorite = (itemId: string) => {
    return favorites.includes(itemId);
  };

  return {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    loadFavorites,
  };
}
