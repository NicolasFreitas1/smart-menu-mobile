import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useRestaurant } from "@/context/RestaurantContext";
import { ModeToggle } from "./theme/mode-toggle"; // certifique-se que é RN compatível

export function PublicHeader() {
  const route = useRoute();
  const navigation = useNavigation();
  const { restaurantId } = useRestaurant();

  if (!restaurantId) return null;

  // Função para saber se rota está ativa
  function isActive(routeName: string) {
    return route.name === routeName;
  }

  // Função para navegar para uma rota com restaurante
  function goTo(routeName: string) {
    navigation.navigate(`${restaurantId}-${routeName}` as never);
  }

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {[
          { label: "Home", route: "home" },
          { label: "Cardápio", route: "menu" },
          { label: "Assistente de Sugestão", route: "assistant" },
          { label: "Surpreenda-me", route: "surprise-me" },
          { label: "Carrinho", route: "cart" },
        ].map(({ label, route }) => (
          <TouchableOpacity
            key={route}
            onPress={() => goTo(route)}
            style={styles.linkContainer}
          >
            <Text style={[styles.linkText, isActive(`${restaurantId}-${route}`) && styles.activeLink]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.right}>
        <ModeToggle />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  left: {
    flexDirection: "row",
    gap: 20, // React Native não suporta gap nativo, pode usar marginRight nas children
  },
  linkContainer: {
    marginRight: 20,
  },
  linkText: {
    fontSize: 16,
    color: "#6b7280", // text-muted-foreground
  },
  activeLink: {
    fontWeight: "700",
    color: "#16a34a", // verde do tailwind "font-bold" + cor primária
  },
  right: {
    justifyContent: "center",
    alignItems: "center",
  },
});
