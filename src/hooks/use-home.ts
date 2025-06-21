import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRestaurant } from "../context/RestaurantContext";
import { useCart } from "../context/CartContext";

export function useHome() {
  const navigation = useNavigation();
  const { restaurant, isLoading } = useRestaurant();
  const { totalItems, totalPrice, hasItems } = useCart();

  const handleSettingsPress = useCallback(() => {
    navigation.navigate("Settings" as never);
  }, [navigation]);

  return {
    // State
    restaurant,
    isLoading,
    totalItems,
    totalPrice,
    hasItems,
    
    // Actions
    handleSettingsPress,
  };
} 