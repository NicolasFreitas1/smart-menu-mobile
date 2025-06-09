import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useRestaurant } from "@/context/RestaurantContext";

import IconHome from "react-native-vector-icons/Feather"; // exemplo, precisa instalar react-native-vector-icons
import IconUtensils from "react-native-vector-icons/FontAwesome5";
import IconBotMessageSquare from "react-native-vector-icons/MaterialCommunityIcons";
import IconLightbulb from "react-native-vector-icons/MaterialCommunityIcons";
import IconShoppingCart from "react-native-vector-icons/Feather";

// Você precisa instalar e linkar a biblioteca react-native-vector-icons para usar esses ícones

export function PublicButtonTabs() {
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurantId } = useRestaurant();

  if (!restaurantId) return null;

  // Função para saber se a rota atual é a ativa
  function isActive(routeName: string) {
    return route.name === routeName;
  }

  return (
    <View style={styles.nav}>
      {/* Home */}
      <TouchableOpacity
        onPress={() => navigation.navigate(`${restaurantId}-home` as never)}
        style={[styles.button, isActive(`${restaurantId}-home`) && styles.activeButton]}
      >
        <IconHome name="home" size={24} color={isActive(`${restaurantId}-home`) ? "#16a34a" : "#6b7280"} />
      </TouchableOpacity>

      {/* Menu */}
      <TouchableOpacity
        onPress={() => navigation.navigate(`${restaurantId}-menu` as never)}
        style={[styles.button, isActive(`${restaurantId}-menu`) && styles.activeButton]}
      >
        <IconUtensils name="utensils" size={24} color={isActive(`${restaurantId}-menu`) ? "#16a34a" : "#6b7280"} />
      </TouchableOpacity>

      {/* Assistente IA - botão destacado flutuante */}
      <TouchableOpacity
        onPress={() => navigation.navigate(`${restaurantId}-assistant` as never)}
        style={[styles.floatingButton, isActive(`${restaurantId}-assistant`) && styles.activeFloatingButton]}
      >
        <IconBotMessageSquare name="robot" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Surpreenda-me */}
      <TouchableOpacity
        onPress={() => navigation.navigate(`${restaurantId}-surprise-me` as never)}
        style={[styles.button, isActive(`${restaurantId}-surprise-me`) && styles.activeButton]}
      >
        <IconLightbulb name="lightbulb-on-outline" size={24} color={isActive(`${restaurantId}-surprise-me`) ? "#16a34a" : "#6b7280"} />
      </TouchableOpacity>

      {/* Carrinho */}
      <TouchableOpacity
        onPress={() => navigation.navigate(`${restaurantId}-cart` as never)}
        style={[styles.button, isActive(`${restaurantId}-cart`) && styles.activeButton]}
      >
        <IconShoppingCart name="shopping-cart" size={24} color={isActive(`${restaurantId}-cart`) ? "#16a34a" : "#6b7280"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
    zIndex: 10,
  },
  button: {
    padding: 8,
  },
  activeButton: {
    // Pode acrescentar efeito visual para ativo
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#16a34a", // verde
    justifyContent: "center",
    alignItems: "center",
    marginTop: -24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  activeFloatingButton: {
    // Pode adicionar algum destaque extra se quiser
  },
});
