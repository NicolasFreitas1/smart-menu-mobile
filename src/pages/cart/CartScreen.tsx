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
import { NavigationBarSafeArea } from "../../components/ui/navigation-bar-safe-area";
import { OrderSummary } from "../../components/order-summary";
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

  const handleOrderComplete = (orderId: string) => {
    // Navegar para o histórico de pedidos após finalizar
    // Você pode implementar a navegação aqui se necessário
    console.log("Pedido finalizado:", orderId);
  };

  return (
    <SafeContainer considerNavigationBar={true}>
      <NavigationBarSafeArea style={localStyles.container}>
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

          {/* OrderSummary Component */}
          <OrderSummary
            cartItems={cartItems}
            totalPrice={totalPrice}
            onOrderComplete={handleOrderComplete}
            onClearCart={handleClearCart}
          />
        </ScrollView>
      </NavigationBarSafeArea>
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
});
