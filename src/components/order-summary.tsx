import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../theme/theme-provider";
import { useCart } from "../context/CartContext";
import { useRestaurant } from "../context/RestaurantContext";
import { useOrders } from "../hooks/use-orders";
import { useNotifications } from "../hooks/use-notifications";
import { formatCurrency } from "../lib/format";
import { Order, OrderItem } from "../services/database";
import Feather from "react-native-vector-icons/Feather";
import { storageService } from "../services/storage";
import { Button } from "./ui/button";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  observations?: string;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  totalPrice: number;
  onOrderComplete?: (orderId: string) => void;
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
        restaurantId: "rest-123", // Você pode pegar isso do contexto do restaurante
        restaurantName: "Restaurante Exemplo", // Você pode pegar isso do contexto do restaurante
        totalAmount: totalPrice,
        status: "pending",
        orderDate: new Date().toISOString(),
        paymentMethod: "card", // Você pode deixar o usuário escolher
        notes: "", // Você pode deixar o usuário adicionar observações
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
        await storageService.clearCart();

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
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Seu carrinho está vazio
        </Text>
        <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
          Adicione itens para finalizar um pedido
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <Text className="text-lg font-semibold mb-4">Resumo do Pedido</Text>

      {/* Lista de itens */}
      <View className="mb-4">
        {cartItems.map((item, index) => (
          <View
            key={index}
            className="flex-row justify-between items-center py-2 border-b border-gray-100"
          >
            <View className="flex-1">
              <Text className="font-medium">{item.name}</Text>
              <Text className="text-sm text-gray-600">
                {item.quantity}x R$ {item.price.toFixed(2)}
              </Text>
              {item.observations && (
                <Text className="text-xs text-gray-500 italic">
                  Obs: {item.observations}
                </Text>
              )}
            </View>
            <Text className="font-semibold">
              R$ {(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Total */}
      <View className="flex-row justify-between items-center py-3 border-t border-gray-200">
        <Text className="text-lg font-semibold">Total</Text>
        <Text className="text-lg font-bold text-green-600">
          R$ {totalPrice.toFixed(2)}
        </Text>
      </View>

      {/* Botão de finalizar */}
      <Button
        onPress={handleFinishOrder}
        disabled={isProcessing || cartItems.length === 0}
        className="mt-4"
      >
        {isProcessing ? (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="white" className="mr-2" />
            <Text className="text-white font-medium">Processando...</Text>
          </View>
        ) : (
          <Text className="text-white font-medium text-center">
            Finalizar Pedido
          </Text>
        )}
      </Button>

      {/* Informações adicionais */}
      <View className="mt-4 p-3 bg-blue-50 rounded-lg">
        <Text className="text-sm text-blue-800">
          💡 Seu pedido será salvo localmente e você receberá notificações sobre
          o status.
        </Text>
      </View>

      {restaurant && (
        <Text style={[styles.restaurantInfo, { color: colors.textSecondary }]}>
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
});
