import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../theme/theme-provider";
import { useCart } from "../context/CartContext";
import { useRestaurant } from "../context/RestaurantContext";
import { useOrders } from "../hooks/use-orders";
import { useNotifications } from "../hooks/use-notifications";
import Feather from "react-native-vector-icons/Feather";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  observations?: string;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  totalPrice: number;
  onOrderComplete?: (orderId: string) => void;
  onClearCart?: () => void;
}

// Função para gerar ID único
const generateOrderId = (): string => {
  return `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Função para gerar ID único para item
const generateItemId = (orderId: string, index: number): string => {
  return `${orderId}-item-${index}`;
};

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  totalPrice,
  onOrderComplete,
  onClearCart,
}) => {
  const { colors } = useTheme();
  const { clearCartDirectly } = useCart();
  const { restaurant } = useRestaurant();
  const { saveOrder } = useOrders();
  const { createOrderUpdateNotification } = useNotifications();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleFinishOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Erro", "Carrinho vazio");
      return;
    }

    setIsProcessing(true);

    try {
      // Criar pedido
      const order = {
        id: generateOrderId(),
        restaurantId: restaurant?.id || "rest-123",
        restaurantName: restaurant?.name || "Restaurante Exemplo",
        totalAmount: totalPrice,
        status: "pending" as const,
        orderDate: new Date().toISOString(),
        paymentMethod: "card" as const,
        notes: "",
      };

      // Criar itens do pedido
      const orderItems = cartItems.map((item, index) => ({
        id: generateItemId(order.id, index),
        orderId: order.id,
        dishId: item.id,
        dishName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        observations: item.observations || undefined,
      }));

      // Salvar pedido no banco
      const success = await saveOrder(order, orderItems);

      if (success) {
        // Criar notificação
        await createOrderUpdateNotification(
          order.id,
          "confirmed",
          order.restaurantName
        );

        // Limpar carrinho
        clearCartDirectly();

        // Chamar callback de sucesso
        onOrderComplete?.(order.id);

        Alert.alert(
          "Sucesso!",
          "Pedido realizado com sucesso! Você receberá atualizações sobre o status.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível finalizar o pedido. Tente novamente."
        );
      }
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao finalizar o pedido. Tente novamente."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
        <Feather
          name="shopping-cart"
          size={48}
          color={colors.mutedForeground}
        />
        <Text style={[styles.emptyText, { color: colors.secondary }]}>
          Seu carrinho está vazio
        </Text>
        <Text style={[styles.emptySubtext, { color: colors.secondary }]}>
          Adicione itens para finalizar um pedido
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.foreground }]}>
        Resumo do Pedido
      </Text>

      {/* Lista de itens */}
      <View style={styles.itemsContainer}>
        {cartItems.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: colors.foreground }]}>
                {item.name}
              </Text>
              <Text
                style={[
                  styles.itemObservations,
                  { color: colors.mutedForeground },
                ]}
              >
                {item.quantity}x R$ {item.price.toFixed(2)}
              </Text>
              {item.observations && (
                <Text
                  style={[
                    styles.itemObservations,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Obs: {item.observations}
                </Text>
              )}
            </View>
            <Text style={[styles.itemPrice, { color: colors.foreground }]}>
              R$ {(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Total */}
      <View style={styles.totalContainer}>
        <Text style={[styles.totalLabel, { color: colors.foreground }]}>
          Total
        </Text>
        <Text style={[styles.totalValue, { color: colors.primary }]}>
          R$ {totalPrice.toFixed(2)}
        </Text>
      </View>

      {/* Botão Limpar Carrinho */}
      {onClearCart && (
        <TouchableOpacity
          onPress={onClearCart}
          style={[
            styles.clearCartButton,
            { backgroundColor: colors.destructive },
          ]}
        >
          <Text
            style={[
              styles.clearCartButtonText,
              { color: colors.primaryForeground },
            ]}
          >
            Limpar Carrinho
          </Text>
        </TouchableOpacity>
      )}

      {/* Botão de finalizar */}
      <TouchableOpacity
        onPress={handleFinishOrder}
        disabled={isProcessing || cartItems.length === 0}
        style={{
          ...styles.finishButton,
          backgroundColor: colors.primary,
          opacity: isProcessing ? 0.6 : 1,
        }}
      >
        {isProcessing ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ActivityIndicator
              size="small"
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.finishButtonText, { color: "white" }]}>
              Processando...
            </Text>
          </View>
        ) : (
          <Text style={[styles.finishButtonText, { color: "white" }]}>
            Finalizar Pedido
          </Text>
        )}
      </TouchableOpacity>

      {/* Informações adicionais */}
      <View style={[styles.infoContainer, { backgroundColor: colors.muted }]}>
        <Text style={[styles.infoText, { color: colors.foreground }]}>
          💡 Seu pedido será salvo localmente e você receberá notificações sobre
          o status.
        </Text>
      </View>

      {restaurant && (
        <Text style={[styles.restaurantInfo, { color: colors.secondary }]}>
          Pedido será enviado para: {restaurant.name}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  itemsContainer: {
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  itemObservations: {
    fontSize: 12,
    fontStyle: "italic",
  },
  itemQuantity: {
    marginHorizontal: 12,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 60,
    textAlign: "right",
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  finishButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  restaurantInfo: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
  },
  emptyContainer: {
    padding: 32,
    borderRadius: 12,
    margin: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  infoContainer: {
    padding: 16,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "500",
  },
  clearCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  clearCartButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
