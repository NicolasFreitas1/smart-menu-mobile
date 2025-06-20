import { View, Text, TouchableOpacity, Image } from "react-native";
import { formatCurrency } from "../lib/format";
import { useCart } from "../context/CartContext";
import { useRestaurant } from "../context/RestaurantContext";
import { useGlobalStyles } from "../theme/hooks";
import { Button } from "./ui/button";
import { FavoriteButton } from "./favorite-button";

interface DishItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
}

export function DishItem({ id, name, description, price }: DishItemProps) {
  const { restaurantId } = useRestaurant();
  const { cartItems, addToCart, removeFromCart } = useCart();
  const styles = useGlobalStyles();

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

  const handleFavoriteToggle = (isFavorite: boolean) => {
    // Aqui você pode adicionar feedback visual ou sonoro
    console.log(
      `${name} ${isFavorite ? "adicionado aos" : "removido dos"} favoritos`
    );
  };

  return (
    <View
      style={[
        styles.card,
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.text,
              { fontSize: 16, fontWeight: "600", marginBottom: 4 },
            ]}
          >
            <Text style={{ fontWeight: "700" }}>Prato: </Text>
            {name}
          </Text>
        </View>
        <FavoriteButton
          itemId={id}
          itemType="dish"
          size={28}
          onToggle={handleFavoriteToggle}
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={[styles.mutedText, { lineHeight: 20 }]}>
          <Text style={{ fontWeight: "700" }}>Descrição: </Text>
          {description}
        </Text>
      </View>

      <Text style={[styles.text, { marginBottom: 16 }]}>
        <Text style={{ fontWeight: "700" }}>Preço: </Text>
        {formatCurrency(price)}
      </Text>

      <View style={{ alignItems: "center" }}>
        {!cartItem ? (
          <Button
            title="Selecionar"
            onPress={handleAdd}
            style={{ minWidth: 120 }}
          />
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <TouchableOpacity
              onPress={handleRemove}
              style={[
                styles.card,
                {
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 6,
                  minWidth: 44,
                  alignItems: "center",
                  padding: 8,
                },
              ]}
            >
              <Text style={[styles.text, { fontSize: 16, fontWeight: "600" }]}>
                -
              </Text>
            </TouchableOpacity>

            <Text style={styles.text}>{cartItem.quantity}</Text>

            <TouchableOpacity
              onPress={handleAdd}
              style={[
                styles.card,
                {
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 6,
                  minWidth: 44,
                  alignItems: "center",
                  padding: 8,
                },
              ]}
            >
              <Text style={[styles.text, { fontSize: 16, fontWeight: "600" }]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
