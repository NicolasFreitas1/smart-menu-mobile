import { useState, useEffect, useCallback } from "react";
import { databaseService } from "../services/database";

// Tipos para compatibilidade
interface OrderRecord {
  id: string;
  restaurantId: string;
  restaurantName: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  deliveryAddress?: string;
  paymentMethod: string;
  notes?: string;
}

interface OrderItemRecord {
  id: string;
  orderId: string;
  dishId: string;
  dishName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  observations?: string;
}

interface OrderStatistics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  favoriteRestaurant: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar pedidos
  const loadOrders = useCallback(
    async (limit: number = 50, offset: number = 0) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await databaseService.getOrders(limit, offset);
        setOrders(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar pedidos"
        );
        console.error("Erro ao carregar pedidos:", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Salvar pedido
  const saveOrder = useCallback(
    async (
      order: OrderRecord,
      orderItems: OrderItemRecord[]
    ): Promise<boolean> => {
      try {
        const success = await databaseService.saveOrder(order, orderItems);
        if (success) {
          // Recarregar pedidos após salvar
          await loadOrders();
        }
        return success;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao salvar pedido");
        console.error("Erro ao salvar pedido:", err);
        return false;
      }
    },
    [loadOrders]
  );

  // Buscar pedido com itens
  const getOrderWithItems = useCallback(async (orderId: string) => {
    try {
      return await databaseService.getOrderWithItems(orderId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar pedido");
      console.error("Erro ao buscar pedido:", err);
      return null;
    }
  }, []);

  // Atualizar status do pedido
  const updateOrderStatus = useCallback(
    async (orderId: string, status: string): Promise<boolean> => {
      try {
        const success = await databaseService.updateOrderStatus(
          orderId,
          status as "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
        );
        if (success) {
          // Recarregar pedidos após atualizar
          await loadOrders();
        }
        return success;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao atualizar status"
        );
        console.error("Erro ao atualizar status:", err);
        return false;
      }
    },
    [loadOrders]
  );

  // Buscar pedidos por restaurante
  const getOrdersByRestaurant = useCallback(
    async (restaurantId: string): Promise<OrderRecord[]> => {
      try {
        return await databaseService.getOrdersByRestaurant(restaurantId);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao buscar pedidos por restaurante"
        );
        console.error("Erro ao buscar pedidos por restaurante:", err);
        return [];
      }
    },
    []
  );

  // Estatísticas dos pedidos
  const getOrderStatistics = useCallback(async (): Promise<OrderStatistics> => {
    try {
      return await databaseService.getOrderStatistics();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao buscar estatísticas"
      );
      console.error("Erro ao buscar estatísticas:", err);
      return {
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        favoriteRestaurant: "Nenhum",
      };
    }
  }, []);

  // Gastos mensais
  const getMonthlySpending = useCallback(
    async (
      months: number = 6
    ): Promise<Array<{ month: string; total: number }>> => {
      try {
        return await databaseService.getMonthlySpending(months);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao buscar gastos mensais"
        );
        console.error("Erro ao buscar gastos mensais:", err);
        return [];
      }
    },
    []
  );

  // Carregar pedidos na inicialização
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return {
    orders,
    isLoading,
    error,
    loadOrders,
    saveOrder,
    getOrderWithItems,
    updateOrderStatus,
    getOrdersByRestaurant,
    getOrderStatistics,
    getMonthlySpending,
  };
};
