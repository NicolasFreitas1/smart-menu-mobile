import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useGlobalStyles } from "../../theme/hooks";
import { useTheme } from "../../theme/theme-provider";
import { useCartScreen } from "../../hooks/use-cart";
import { CartEmpty } from "../../components/cart/cart-empty";
import { SafeContainer } from "../../components/ui/safe-container";
import { formatCurrency } from "../../lib/format";

export function CartScreen() {
  const styles = useGlobalStyles();
  const { colors } = useTheme();
  const {
    cartItems,
    totalPrice,
    handleRemoveFromCart,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleClearCart,
    handleFinalizeOrder,
  } = useCartScreen();

  if (cartItems.length === 0) {
    return <CartEmpty />;
  }

  return (
    <SafeContainer>
      <View style={localStyles.container}>
        <Text style={[styles.title, localStyles.headerTitle]}>
          Seu Carrinho
        </Text>

        <ScrollView
          style={localStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={localStyles.scrollContent}
        >
          <View style={localStyles.cartItemsContainer}>
            {cartItems.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.card,
                  localStyles.cartItem,
                  {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  },
                ]}
              >
                {/* Header do Card */}
                <View style={localStyles.cardHeader}>
                  <Text style={[styles.text, localStyles.itemName]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.text, localStyles.itemPrice]}>
                    {formatCurrency(item.price * item.quantity)}
                  </Text>
                </View>

                {/* Content do Card */}
                <View style={localStyles.cardContent}>
                  <Text style={[styles.mutedText, localStyles.itemDescription]}>
                    {item.description}
                  </Text>

                  <View style={localStyles.quantityContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        handleDecreaseQuantity({
                          id: item.id,
                          name: item.name,
                          description: item.description,
                          price: item.price,
                          restaurantId: item.restaurantId,
                        })
                      }
                      style={[
                        styles.buttonSecondary,
                        localStyles.quantityButton,
                      ]}
                    >
                      <Text style={styles.buttonTextSecondary}>-</Text>
                    </TouchableOpacity>

                    <Text style={[styles.text, localStyles.quantityText]}>
                      {item.quantity}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        handleIncreaseQuantity({
                          id: item.id,
                          name: item.name,
                          description: item.description,
                          price: item.price,
                          restaurantId: item.restaurantId,
                        })
                      }
                      style={[
                        styles.buttonSecondary,
                        localStyles.quantityButton,
                      ]}
                    >
                      <Text style={styles.buttonTextSecondary}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Footer com Total e Botões */}
        <View style={localStyles.footer}>
          <Text style={[styles.title, localStyles.totalText]}>
            Total: {formatCurrency(totalPrice)}
          </Text>

          <View style={localStyles.actionsContainer}>
            <TouchableOpacity
              onPress={handleClearCart}
              style={[styles.buttonSecondary, localStyles.clearButton]}
            >
              <Text style={styles.buttonTextSecondary}>Limpar Carrinho</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleFinalizeOrder}
              style={[styles.buttonPrimary, localStyles.finalizeButton]}
            >
              <Text style={styles.buttonText}>Finalizar Pedido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeContainer>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerTitle: {
    textAlign: "center",
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cartItemsContainer: {
    marginBottom: 20,
  },
  cartItem: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#16a34a", // green-700
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemDescription: {
    flex: 1,
    marginRight: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  quantityButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 40,
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  totalText: {
    fontSize: 18,
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    marginHorizontal: 6,
    width: "100%",
  },
  clearButton: {
    flex: 1,
    marginRight: 6,
  },
  finalizeButton: {
    flex: 2,
    marginLeft: 6,
    backgroundColor: "#16a34a", // green-600
  },
});
