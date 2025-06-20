import {
  databaseService,
  Order,
  OrderItem,
  Review,
  Notification,
} from "../services/database";

// Dados de exemplo para testar o sistema
export const sampleOrders: Order[] = [
  {
    id: "order-001",
    restaurantId: "restaurant-1",
    restaurantName: "Restaurante Italiano",
    totalAmount: 45.9,
    status: "delivered",
    orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias atrás
    paymentMethod: "card",
    notes: "Entregar no portão",
  },
  {
    id: "order-002",
    restaurantId: "restaurant-2",
    restaurantName: "Pizzaria Express",
    totalAmount: 32.5,
    status: "ready",
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
    paymentMethod: "pix",
    notes: "",
  },
  {
    id: "order-003",
    restaurantId: "restaurant-1",
    restaurantName: "Restaurante Italiano",
    totalAmount: 28.75,
    status: "preparing",
    orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
    paymentMethod: "cash",
    notes: "Sem cebola",
  },
  {
    id: "order-004",
    restaurantId: "restaurant-3",
    restaurantName: "Hamburgueria Gourmet",
    totalAmount: 67.8,
    status: "confirmed",
    orderDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 horas atrás
    paymentMethod: "card",
    notes: "Bem passado",
  },
  {
    id: "order-005",
    restaurantId: "restaurant-2",
    restaurantName: "Pizzaria Express",
    totalAmount: 41.2,
    status: "pending",
    orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
    paymentMethod: "pix",
    notes: "",
  },
];

export const sampleOrderItems: OrderItem[] = [
  // Pedido 001
  {
    id: "item-001-1",
    orderId: "order-001",
    dishId: "dish-001",
    dishName: "Espaguete à Bolonhesa",
    quantity: 2,
    unitPrice: 18.9,
    totalPrice: 37.8,
    observations: "Bem cozido",
  },
  {
    id: "item-001-2",
    orderId: "order-001",
    dishId: "dish-002",
    dishName: "Refrigerante",
    quantity: 1,
    unitPrice: 8.1,
    totalPrice: 8.1,
    observations: "",
  },
  // Pedido 002
  {
    id: "item-002-1",
    orderId: "order-002",
    dishId: "dish-003",
    dishName: "Pizza Margherita",
    quantity: 1,
    unitPrice: 25.5,
    totalPrice: 25.5,
    observations: "Borda recheada",
  },
  {
    id: "item-002-2",
    orderId: "order-002",
    dishId: "dish-004",
    dishName: "Suco Natural",
    quantity: 1,
    unitPrice: 7.0,
    totalPrice: 7.0,
    observations: "",
  },
  // Pedido 003
  {
    id: "item-003-1",
    orderId: "order-003",
    dishId: "dish-005",
    dishName: "Lasanha",
    quantity: 1,
    unitPrice: 28.75,
    totalPrice: 28.75,
    observations: "Sem cebola",
  },
  // Pedido 004
  {
    id: "item-004-1",
    orderId: "order-004",
    dishId: "dish-006",
    dishName: "X-Burger Especial",
    quantity: 2,
    unitPrice: 25.9,
    totalPrice: 51.8,
    observations: "Bem passado",
  },
  {
    id: "item-004-2",
    orderId: "order-004",
    dishId: "dish-007",
    dishName: "Batata Frita",
    quantity: 1,
    unitPrice: 16.0,
    totalPrice: 16.0,
    observations: "",
  },
  // Pedido 005
  {
    id: "item-005-1",
    orderId: "order-005",
    dishId: "dish-008",
    dishName: "Pizza Quatro Queijos",
    quantity: 1,
    unitPrice: 35.2,
    totalPrice: 35.2,
    observations: "",
  },
  {
    id: "item-005-2",
    orderId: "order-005",
    dishId: "dish-009",
    dishName: "Água",
    quantity: 1,
    unitPrice: 6.0,
    totalPrice: 6.0,
    observations: "",
  },
];

export const sampleReviews: Review[] = [
  {
    id: "review-001",
    orderId: "order-001",
    dishId: "dish-001",
    rating: 5,
    comment: "Espaguete perfeito! Muito saboroso.",
    reviewDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "review-002",
    orderId: "order-001",
    dishId: "dish-002",
    rating: 4,
    comment: "Refrigerante bem gelado.",
    reviewDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "review-003",
    orderId: "order-002",
    dishId: "dish-003",
    rating: 4,
    comment: "Pizza muito boa, massa no ponto.",
    reviewDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "review-004",
    orderId: "order-003",
    dishId: "dish-005",
    rating: 3,
    comment: "Lasanha boa, mas poderia ter mais queijo.",
    reviewDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

export const sampleNotifications: Notification[] = [
  {
    id: "notif-001",
    title: "Pedido Confirmado",
    message: "Restaurante Italiano confirmou seu pedido #001",
    type: "order_update",
    isRead: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    data: {
      orderId: "order-001",
      status: "confirmed",
      restaurantName: "Restaurante Italiano",
    },
  },
  {
    id: "notif-002",
    title: "Pedido em Preparação",
    message: "Pizzaria Express está preparando seu pedido #002",
    type: "order_update",
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    data: {
      orderId: "order-002",
      status: "preparing",
      restaurantName: "Pizzaria Express",
    },
  },
  {
    id: "notif-003",
    title: "Pedido Pronto",
    message: "Seu pedido #002 está pronto para retirada!",
    type: "order_update",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    data: {
      orderId: "order-002",
      status: "ready",
      restaurantName: "Pizzaria Express",
    },
  },
  {
    id: "notif-004",
    title: "Promoção Especial",
    message: "20% de desconto em pizzas hoje!",
    type: "promotion",
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    data: { discount: 20, category: "pizza" },
  },
  {
    id: "notif-005",
    title: "Lembrete",
    message: "Não esqueça de avaliar seu último pedido!",
    type: "reminder",
    isRead: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    data: { orderId: "order-003" },
  },
];

// Função para popular o banco com dados de exemplo
export async function populateSampleData() {
  try {
    console.log("Populando banco de dados com dados de exemplo...");

    // Salva pedidos
    for (const order of sampleOrders) {
      const orderItems = sampleOrderItems.filter(
        (item) => item.orderId === order.id
      );
      await databaseService.saveOrder(order, orderItems);
    }

    // Salva avaliações
    for (const review of sampleReviews) {
      await databaseService.saveReview(review);
    }

    // Salva notificações
    for (const notification of sampleNotifications) {
      await databaseService.saveNotification(notification);
    }

    console.log("Dados de exemplo inseridos com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao popular dados de exemplo:", error);
    return false;
  }
}

// Função para limpar todos os dados
export async function clearAllData() {
  try {
    console.log("Limpando todos os dados...");
    await databaseService.cleanupOldData(0); // Remove todos os dados
    console.log("Dados limpos com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao limpar dados:", error);
    return false;
  }
}

// Função para exportar dados
export async function exportAllData() {
  try {
    const data = await databaseService.exportData();
    console.log("Dados exportados:", data);
    return data;
  } catch (error) {
    console.error("Erro ao exportar dados:", error);
    return null;
  }
}
