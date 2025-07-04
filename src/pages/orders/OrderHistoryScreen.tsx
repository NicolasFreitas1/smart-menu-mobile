import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../theme/theme-provider";
import { useOrders } from "../../hooks/use-orders";
import { useNotifications } from "../../hooks/use-notifications";
import { SafeContainer } from "../../components/ui/safe-container";
import { formatCurrency } from "../../lib/format";
import Feather from "react-native-vector-icons/Feather";

interface OrderHistoryScreenProps {
  navigation: any;
}

export function OrderHistoryScreen({ navigation }: OrderHistoryScreenProps) {
  const { colors } = useTheme();
  const {
    orders,
    isLoading,
    error,
    loadOrders,
    getOrderStatistics,
    getMonthlySpending,
  } = useOrders();
  const { createOrderUpdateNotification } = useNotifications();
  const [statistics, setStatistics] = useState<any>(null);
  const [monthlySpending, setMonthlySpending] = useState<any[]>([]);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    const stats = await getOrderStatistics();
    const monthly = await getMonthlySpending();
    setStatistics(stats);
    setMonthlySpending(monthly);
  };

  const getStatusColor = (status: string) => {
    const statusColors = {
      pending: colors.mutedForeground,
      confirmed: colors.primary,
      preparing: colors.primary,
      ready: colors.primary,
      delivered: colors.primary,
      cancelled: colors.destructive,
    };
    return (
      statusColors[status as keyof typeof statusColors] ||
      colors.mutedForeground
    );
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      pending: "Pendente",
      confirmed: "Confirmado",
      preparing: "Preparando",
      ready: "Pronto",
      delivered: "Entregue",
      cancelled: "Cancelado",
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  const getStatusIcon = (status: string) => {
    const statusIcons = {
      pending: "clock",
      confirmed: "check-circle",
      preparing: "coffee",
      ready: "check-square",
      delivered: "truck",
      cancelled: "x-circle",
    };
    return statusIcons[status as keyof typeof statusIcons] || "help-circle";
  };

  const handleOrderPress = (order: any) => {
    // Aqui você pode navegar para detalhes do pedido
    Alert.alert(
      `Pedido #${order.id.slice(-6)}`,
      `Restaurante: ${order.restaurantName}\nStatus: ${getStatusText(
        order.status
      )}\nTotal: ${formatCurrency(order.totalAmount)}`,
      [
        { text: "OK" },
        {
          text: "Simular Atualização",
          onPress: () => simulateOrderUpdate(order),
        },
      ]
    );
  };

  const simulateOrderUpdate = async (order: any) => {
    const statuses: any[] = ["confirmed", "preparing", "ready", "delivered"];
    const currentIndex = statuses.indexOf(order.status);
    const nextStatus = statuses[currentIndex + 1] || statuses[0];

    // Simula uma atualização de status
    await createOrderUpdateNotification(
      order.id,
      nextStatus,
      order.restaurantName
    );

    Alert.alert(
      "Notificação Criada",
      `Status atualizado para: ${getStatusText(nextStatus)}`
    );
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.orderItem,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={() => handleOrderPress(item)}
    >
      <View style={styles.orderHeader}>
        <Text style={[styles.orderId, { color: colors.foreground }]}>
          Pedido #{item.id.slice(-6)}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Feather
            name={getStatusIcon(item.status) as any}
            size={12}
            color={colors.primaryForeground}
          />
          <Text
            style={[styles.statusText, { color: colors.primaryForeground }]}
          >
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <Text style={[styles.restaurantName, { color: colors.foreground }]}>
        {item.restaurantName}
      </Text>

      <View style={styles.orderFooter}>
        <Text style={[styles.orderDate, { color: colors.mutedForeground }]}>
          {new Date(item.orderDate).toLocaleDateString("pt-BR")}
        </Text>
        <Text style={[styles.orderTotal, { color: colors.foreground }]}>
          {formatCurrency(item.totalAmount)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderStatistics = () => (
    <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
      <Text style={[styles.statsTitle, { color: colors.foreground }]}>
        Estatísticas
      </Text>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {statistics?.totalOrders || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Total de Pedidos
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {formatCurrency(statistics?.totalSpent || 0)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Total Gasto
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {formatCurrency(statistics?.averageOrderValue || 0)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Média por Pedido
          </Text>
        </View>
      </View>

      {statistics?.favoriteRestaurant && (
        <View style={styles.favoriteRestaurant}>
          <Text
            style={[styles.favoriteLabel, { color: colors.mutedForeground }]}
          >
            Restaurante Favorito:
          </Text>
          <Text style={[styles.favoriteName, { color: colors.foreground }]}>
            {statistics.favoriteRestaurant}
          </Text>
        </View>
      )}
    </View>
  );

  const renderMonthlySpending = () => (
    <View style={[styles.monthlyContainer, { backgroundColor: colors.card }]}>
      <Text style={[styles.monthlyTitle, { color: colors.foreground }]}>
        Gastos Mensais
      </Text>

      {monthlySpending.map((month, index) => (
        <View key={month.month} style={styles.monthlyItem}>
          <Text style={[styles.monthlyMonth, { color: colors.foreground }]}>
            {new Date(month.month + "-01").toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <Text style={[styles.monthlyAmount, { color: colors.primary }]}>
            {formatCurrency(month.total)}
          </Text>
        </View>
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <SafeContainer
        style={{ flex: 1, padding: 16, backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeContainer>
    );
  }

  if (error) {
    return (
      <SafeContainer
        style={{ flex: 1, padding: 16, backgroundColor: colors.background }}
      >
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.destructive }]}>
            Erro ao carregar pedidos
          </Text>
          <Text
            style={[styles.errorSubtext, { color: colors.mutedForeground }]}
          >
            {error}
          </Text>
        </View>
      </SafeContainer>
    );
  }

  return (
    <SafeContainer style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="package" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Nenhum pedido encontrado
            </Text>
            <Text
              style={[styles.emptySubtext, { color: colors.mutedForeground }]}
            >
              Seus pedidos aparecerão aqui
            </Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View>
                {renderStatistics()}
                {renderMonthlySpending()}
                <Text
                  style={[styles.sectionTitle, { color: colors.foreground }]}
                >
                  Pedidos Recentes
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  statsContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  favoriteRestaurant: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 12,
  },
  favoriteLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  favoriteName: {
    fontSize: 14,
    fontWeight: "500",
  },
  monthlyContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  monthlyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  monthlyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  monthlyMonth: {
    fontSize: 14,
  },
  monthlyAmount: {
    fontSize: 14,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  orderItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  restaurantName: {
    fontSize: 14,
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderDate: {
    fontSize: 12,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
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
  errorContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});
