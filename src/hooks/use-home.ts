import { useCallback } from "react";
import { useRestaurant } from "../context/RestaurantContext";
import { useCart } from "../context/CartContext";

export function useHome() {
  const { restaurant, isLoading } = useRestaurant();
  const { totalItems, totalPrice, hasItems } = useCart();

  const handleSettingsPress = useCallback(() => {
    // Aqui você pode navegar para a tela de configurações
    console.log("Navegar para configurações");
  }, []);

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