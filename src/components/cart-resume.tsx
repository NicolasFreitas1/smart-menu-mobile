import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRestaurant } from "@/context/RestaurantContext";
import { useNavigation } from "@react-navigation/native";

interface CartResumeProps {
  totalItems: number;
  totalPrice: number;
}

export function CartResume({ totalItems, totalPrice }: CartResumeProps) {
  const { restaurantId } = useRestaurant();
  const navigation = useNavigation();

  // Função simples para formatar preço em reais
  function formatPrice(price: number) {
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  }

  return (
    <View style={styles.container}>
      <View>
        <Text>
          <Text style={styles.bold}>{totalItems}</Text> item{totalItems > 1 ? "s" : ""} no carrinho
        </Text>
        <Text style={styles.subText}>
          Total: {formatPrice(totalPrice)}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate(`${restaurantId}/cart` as never)}
      >
        <Text style={styles.link}>Ver carrinho</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#d1fae5", // green-100
    padding: 16,
    borderRadius: 8,
    width: "100%",
    maxWidth: 320,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bold: {
    fontWeight: "bold",
  },
  subText: {
    fontSize: 12,
    color: "#6b7280", // text-muted-foreground
  },
  link: {
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
    color: "#166534", // green-800
  },
});
