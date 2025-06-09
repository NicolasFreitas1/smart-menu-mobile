import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useCart } from "@/context/CartContext";
import { useRestaurant } from "@/context/RestaurantContext";

interface DishItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
}

export function DishItem({ id, description, name, price }: DishItemProps) {
  const { restaurantId } = useRestaurant();
  const { cartItems, addToCart, removeFromCart } = useCart();

  const cartItem = cartItems.find((item) => item.id === id);

  function handleAdd() {
    addToCart({
      id,
      name,
      description,
      price,
      restaurantId: restaurantId ?? "",
    });
  }

  function handleRemove() {
    removeFromCart(id);
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.boldText}>Prato: <Text>{name}</Text></Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.description}>
          <Text style={styles.boldText}>Descrição: </Text>
          {description}
        </Text>
        <Text style={styles.price}>
          <Text style={styles.boldText}>Preço: </Text>
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(price)}
        </Text>

        <View style={styles.actions}>
          {!cartItem ? (
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleAdd}
            >
              <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
                Selecionar
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={[styles.button, styles.buttonOutline]}
                onPress={handleRemove}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.quantity}>{cartItem.quantity}</Text>

              <TouchableOpacity
                style={[styles.button, styles.buttonOutline]}
                onPress={handleAdd}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
    elevation: 2, // sombra android
    shadowColor: "#000", // sombra ios
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cardContent: {
    padding: 12,
  },
  boldText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111",
  },
  description: {
    marginBottom: 8,
    fontSize: 14,
    color: "#444",
  },
  price: {
    marginBottom: 16,
    fontSize: 14,
    color: "#111",
  },
  actions: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonPrimary: {
    backgroundColor: "#16a34a", // green-600
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: "#16a34a",
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#16a34a",
    textAlign: "center",
  },
  buttonTextPrimary: {
    color: "white",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16, // gap não funciona no RN, substitua por marginRight no botão e marginHorizontal no texto
  },
  quantity: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 12,
  },
});
