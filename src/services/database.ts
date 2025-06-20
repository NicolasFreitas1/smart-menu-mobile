import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";
import { storageService } from "./storage";

// Tipos para o banco de dados
export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
  orderDate: string;
  deliveryAddress?: string;
  paymentMethod: "cash" | "card" | "pix";
  notes?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  dishId: string;
  dishName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  observations?: string;
}

export interface Review {
  id: string;
  orderId: string;
  dishId?: string;
  rating: number;
  comment?: string;
  reviewDate: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order_update" | "promotion" | "reminder" | "system";
  isRead: boolean;
  createdAt: string;
  data?: any;
}

// Interface para compatibilidade entre SQLite e AsyncStorage
interface DatabaseRecord {
  id: string;
  [key: string]: any;
}

interface OrderRecord extends DatabaseRecord {
  restaurantId: string;
  restaurantName: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  deliveryAddress?: string;
  paymentMethod: string;
  notes?: string;
}

interface OrderItemRecord extends DatabaseRecord {
  orderId: string;
  dishId: string;
  dishName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  observations?: string;
}

interface ReviewRecord extends DatabaseRecord {
  orderId: string;
  dishId?: string;
  rating: number;
  comment?: string;
  reviewDate: string;
}

interface NotificationRecord extends DatabaseRecord {
  title: string;
  message: string;
  type: string;
  isRead: number;
  createdAt: string;
  data?: string;
}

// Classe principal do banco de dados
class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private isWeb = Platform.OS === "web";
  private isInitialized = false;

  // Inicializa o banco de dados
  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (this.isWeb) {
        // No web, usamos AsyncStorage como fallback
        console.log("🖥️ Executando no web - usando AsyncStorage como fallback");
        this.isInitialized = true;
        return;
      }

      // No mobile, usamos SQLite
      this.db = await SQLite.openDatabaseAsync("smart-menu.db");

      // Criar tabelas
      await this.createTables();

      this.isInitialized = true;
      console.log("✅ Banco SQLite inicializado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao inicializar banco:", error);

      // Fallback para AsyncStorage se SQLite falhar
      console.log("🔄 Usando AsyncStorage como fallback");
      this.isWeb = true;
      this.isInitialized = true;
    }
  }

  // Cria as tabelas necessárias
  private async createTables(): Promise<void> {
    if (this.isWeb || !this.db) return;

    const createTablesSQL = `
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        restaurantId TEXT NOT NULL,
        restaurantName TEXT NOT NULL,
        totalAmount REAL NOT NULL,
        status TEXT NOT NULL,
        orderDate TEXT NOT NULL,
        deliveryAddress TEXT,
        paymentMethod TEXT NOT NULL,
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        orderId TEXT NOT NULL,
        dishId TEXT NOT NULL,
        dishName TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unitPrice REAL NOT NULL,
        totalPrice REAL NOT NULL,
        observations TEXT,
        FOREIGN KEY (orderId) REFERENCES orders (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        orderId TEXT NOT NULL,
        dishId TEXT,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        reviewDate TEXT NOT NULL,
        FOREIGN KEY (orderId) REFERENCES orders (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        isRead INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL,
        data TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders (restaurantId);
      CREATE INDEX IF NOT EXISTS idx_orders_date ON orders (orderDate);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
      CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items (orderId);
      CREATE INDEX IF NOT EXISTS idx_reviews_order ON reviews (orderId);
      CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications (isRead);
      CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications (createdAt);
    `;

    await this.db.execAsync(createTablesSQL);
  }

  // ===== MÉTODOS PARA PEDIDOS =====

  // Salva um novo pedido
  async saveOrder(
    order: OrderRecord,
    orderItems: OrderItemRecord[]
  ): Promise<boolean> {
    try {
      if (this.isWeb) {
        return await this.saveOrderToStorage(order, orderItems);
      }

      if (!this.db) throw new Error("Database not initialized");

      await this.db.runAsync(
        "INSERT INTO orders (id, restaurantId, restaurantName, totalAmount, status, orderDate, deliveryAddress, paymentMethod, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          order.id,
          order.restaurantId,
          order.restaurantName,
          order.totalAmount,
          order.status,
          order.orderDate,
          order.deliveryAddress || null,
          order.paymentMethod,
          order.notes || null,
        ]
      );

      for (const item of orderItems) {
        await this.db.runAsync(
          "INSERT INTO order_items (id, orderId, dishId, dishName, quantity, unitPrice, totalPrice, observations) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            item.id,
            item.orderId,
            item.dishId,
            item.dishName,
            item.quantity,
            item.unitPrice,
            item.totalPrice,
            item.observations || null,
          ]
        );
      }

      return true;
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      return false;
    }
  }

  private async saveOrderToStorage(
    order: OrderRecord,
    orderItems: OrderItemRecord[]
  ): Promise<boolean> {
    try {
      const orders = await this.getOrdersFromStorage();
      orders.push(order);
      await storageService.setItem("sqlite_orders", JSON.stringify(orders));

      const items = await this.getOrderItemsFromStorage();
      items.push(...orderItems);
      await storageService.setItem("sqlite_order_items", JSON.stringify(items));

      return true;
    } catch (error) {
      console.error("Erro ao salvar pedido no storage:", error);
      return false;
    }
  }

  // Busca todos os pedidos
  async getOrders(
    limit: number = 50,
    offset: number = 0
  ): Promise<OrderRecord[]> {
    try {
      if (this.isWeb) {
        return await this.getOrdersFromStorage(limit, offset);
      }

      if (!this.db) throw new Error("Database not initialized");

      const result = await this.db.getAllAsync(
        "SELECT * FROM orders ORDER BY orderDate DESC LIMIT ? OFFSET ?",
        [limit, offset]
      );

      return result as OrderRecord[];
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      return [];
    }
  }

  private async getOrdersFromStorage(
    limit: number = 50,
    offset: number = 0
  ): Promise<OrderRecord[]> {
    try {
      const ordersJson = await storageService.getItem("sqlite_orders");
      if (!ordersJson) return [];

      const orders: OrderRecord[] = JSON.parse(ordersJson);
      return orders
        .sort(
          (a, b) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        )
        .slice(offset, offset + limit);
    } catch (error) {
      console.error("Erro ao buscar pedidos do storage:", error);
      return [];
    }
  }

  private async getOrderItemsFromStorage(): Promise<OrderItemRecord[]> {
    try {
      const itemsJson = await storageService.getItem("sqlite_order_items");
      return itemsJson ? JSON.parse(itemsJson) : [];
    } catch (error) {
      console.error("Erro ao buscar itens do storage:", error);
      return [];
    }
  }

  // Busca pedido por ID com itens
  async getOrderWithItems(
    orderId: string
  ): Promise<{ order: OrderRecord; items: OrderItemRecord[] } | null> {
    try {
      if (this.isWeb) {
        return await this.getOrderWithItemsFromStorage(orderId);
      }

      if (!this.db) throw new Error("Database not initialized");

      const orderResult = await this.db.getFirstAsync(
        "SELECT * FROM orders WHERE id = ?",
        [orderId]
      );
      if (!orderResult) return null;

      const itemsResult = await this.db.getAllAsync(
        "SELECT * FROM order_items WHERE orderId = ?",
        [orderId]
      );

      return {
        order: orderResult as OrderRecord,
        items: itemsResult as OrderItemRecord[],
      };
    } catch (error) {
      console.error("Erro ao buscar pedido com itens:", error);
      return null;
    }
  }

  private async getOrderWithItemsFromStorage(
    orderId: string
  ): Promise<{ order: OrderRecord; items: OrderItemRecord[] } | null> {
    try {
      const orders = await this.getOrdersFromStorage();
      const order = orders.find((o) => o.id === orderId);
      if (!order) return null;

      const items = await this.getOrderItemsFromStorage();
      const orderItems = items.filter((item) => item.orderId === orderId);

      return { order, items: orderItems };
    } catch (error) {
      console.error("Erro ao buscar pedido com itens do storage:", error);
      return null;
    }
  }

  // Atualiza status do pedido
  async updateOrderStatus(
    orderId: string,
    status: Order["status"]
  ): Promise<boolean> {
    try {
      if (this.isWeb) {
        return await this.updateOrderStatusInStorage(orderId, status);
      }

      if (!this.db) throw new Error("Database not initialized");

      await this.db.runAsync("UPDATE orders SET status = ? WHERE id = ?", [
        status,
        orderId,
      ]);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      return false;
    }
  }

  private async updateOrderStatusInStorage(
    orderId: string,
    status: string
  ): Promise<boolean> {
    try {
      const orders = await this.getOrdersFromStorage();
      const orderIndex = orders.findIndex((o) => o.id === orderId);
      if (orderIndex === -1) return false;

      orders[orderIndex].status = status;
      await storageService.setItem("sqlite_orders", JSON.stringify(orders));
      return true;
    } catch (error) {
      console.error("Erro ao atualizar status do pedido no storage:", error);
      return false;
    }
  }

  // Busca pedidos por restaurante
  async getOrdersByRestaurant(restaurantId: string): Promise<OrderRecord[]> {
    try {
      if (this.isWeb) {
        const orders = await this.getOrdersFromStorage();
        return orders.filter((order) => order.restaurantId === restaurantId);
      }

      if (!this.db) throw new Error("Database not initialized");

      const result = await this.db.getAllAsync(
        "SELECT * FROM orders WHERE restaurantId = ? ORDER BY orderDate DESC",
        [restaurantId]
      );

      return result as OrderRecord[];
    } catch (error) {
      console.error("Erro ao buscar pedidos por restaurante:", error);
      return [];
    }
  }

  // ===== MÉTODOS PARA AVALIAÇÕES =====

  // Salva uma avaliação
  async saveReview(review: ReviewRecord): Promise<boolean> {
    try {
      if (this.isWeb) {
        return await this.saveReviewToStorage(review);
      }

      if (!this.db) throw new Error("Database not initialized");

      await this.db.runAsync(
        "INSERT INTO reviews (id, orderId, dishId, rating, comment, reviewDate) VALUES (?, ?, ?, ?, ?, ?)",
        [
          review.id,
          review.orderId,
          review.dishId || null,
          review.rating,
          review.comment || null,
          review.reviewDate,
        ]
      );

      return true;
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
      return false;
    }
  }

  private async saveReviewToStorage(review: ReviewRecord): Promise<boolean> {
    try {
      const reviews = await this.getReviewsFromStorage();
      reviews.push(review);
      await storageService.setItem("sqlite_reviews", JSON.stringify(reviews));
      return true;
    } catch (error) {
      console.error("Erro ao salvar avaliação no storage:", error);
      return false;
    }
  }

  private async getReviewsFromStorage(): Promise<ReviewRecord[]> {
    try {
      const reviewsJson = await storageService.getItem("sqlite_reviews");
      return reviewsJson ? JSON.parse(reviewsJson) : [];
    } catch (error) {
      console.error("Erro ao buscar avaliações do storage:", error);
      return [];
    }
  }

  // Busca avaliações de um pedido
  async getReviewsByOrder(orderId: string): Promise<ReviewRecord[]> {
    try {
      if (this.isWeb) {
        const reviews = await this.getReviewsFromStorage();
        return reviews.filter((review) => review.orderId === orderId);
      }

      if (!this.db) throw new Error("Database not initialized");

      const result = await this.db.getAllAsync(
        "SELECT * FROM reviews WHERE orderId = ?",
        [orderId]
      );
      return result as ReviewRecord[];
    } catch (error) {
      console.error("Erro ao buscar avaliações por pedido:", error);
      return [];
    }
  }

  // Busca avaliações de um prato
  async getReviewsByDish(dishId: string): Promise<ReviewRecord[]> {
    try {
      if (this.isWeb) {
        const reviews = await this.getReviewsFromStorage();
        return reviews.filter((review) => review.dishId === dishId);
      }

      if (!this.db) throw new Error("Database not initialized");

      const result = await this.db.getAllAsync(
        "SELECT * FROM reviews WHERE dishId = ?",
        [dishId]
      );
      return result as ReviewRecord[];
    } catch (error) {
      console.error("Erro ao buscar avaliações por prato:", error);
      return [];
    }
  }

  // Calcula média de avaliações de um prato
  async getAverageRating(dishId: string): Promise<number> {
    try {
      if (this.isWeb) {
        const reviews = await this.getReviewsFromStorage();
        const dishReviews = reviews.filter(
          (review) => review.dishId === dishId
        );
        if (dishReviews.length === 0) return 0;

        const totalRating = dishReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        return totalRating / dishReviews.length;
      }

      if (!this.db) throw new Error("Database not initialized");

      const result = await this.db.getFirstAsync(
        "SELECT AVG(rating) as average FROM reviews WHERE dishId = ?",
        [dishId]
      );

      return result?.average || 0;
    } catch (error) {
      console.error("Erro ao calcular média de avaliações:", error);
      return 0;
    }
  }

  // ===== MÉTODOS PARA NOTIFICAÇÕES =====

  // Salva uma notificação
  async saveNotification(notification: NotificationRecord): Promise<boolean> {
    try {
      if (this.isWeb) {
        return await this.saveNotificationToStorage(notification);
      }

      if (!this.db) throw new Error("Database not initialized");

      await this.db.runAsync(
        "INSERT INTO notifications (id, title, message, type, isRead, createdAt, data) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          notification.id,
          notification.title,
          notification.message,
          notification.type,
          notification.isRead,
          notification.createdAt,
          notification.data || null,
        ]
      );

      return true;
    } catch (error) {
      console.error("Erro ao salvar notificação:", error);
      return false;
    }
  }

  private async saveNotificationToStorage(
    notification: NotificationRecord
  ): Promise<boolean> {
    try {
      const notifications = await this.getNotificationsFromStorage();
      notifications.push(notification);
      await storageService.setItem(
        "sqlite_notifications",
        JSON.stringify(notifications)
      );
      return true;
    } catch (error) {
      console.error("Erro ao salvar notificação no storage:", error);
      return false;
    }
  }

  // Busca notificações
  async getNotifications(
    limit: number = 50,
    offset: number = 0
  ): Promise<NotificationRecord[]> {
    try {
      if (this.isWeb) {
        return await this.getNotificationsFromStorage(limit, offset);
      }

      if (!this.db) throw new Error("Database not initialized");

      const result = await this.db.getAllAsync(
        "SELECT * FROM notifications ORDER BY createdAt DESC LIMIT ? OFFSET ?",
        [limit, offset]
      );

      return result as NotificationRecord[];
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      return [];
    }
  }

  private async getNotificationsFromStorage(
    limit: number = 50,
    offset: number = 0
  ): Promise<NotificationRecord[]> {
    try {
      const notificationsJson = await storageService.getItem(
        "sqlite_notifications"
      );
      if (!notificationsJson) return [];

      const notifications: NotificationRecord[] = JSON.parse(notificationsJson);
      return notifications
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(offset, offset + limit);
    } catch (error) {
      console.error("Erro ao buscar notificações do storage:", error);
      return [];
    }
  }

  // Marca notificação como lida
  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      if (this.isWeb) {
        return await this.markNotificationAsReadInStorage(notificationId);
      }

      if (!this.db) throw new Error("Database not initialized");

      await this.db.runAsync(
        "UPDATE notifications SET isRead = 1 WHERE id = ?",
        [notificationId]
      );
      return true;
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      return false;
    }
  }

  private async markNotificationAsReadInStorage(
    notificationId: string
  ): Promise<boolean> {
    try {
      const notifications = await this.getNotificationsFromStorage();
      const notificationIndex = notifications.findIndex(
        (n) => n.id === notificationId
      );
      if (notificationIndex === -1) return false;

      notifications[notificationIndex].isRead = 1;
      await storageService.setItem(
        "sqlite_notifications",
        JSON.stringify(notifications)
      );
      return true;
    } catch (error) {
      console.error("Erro ao marcar notificação como lida no storage:", error);
      return false;
    }
  }

  // Marca todas as notificações como lidas
  async markAllNotificationsAsRead(): Promise<boolean> {
    try {
      if (this.isWeb) {
        return await this.markAllNotificationsAsReadInStorage();
      }

      if (!this.db) throw new Error("Database not initialized");

      await this.db.runAsync("UPDATE notifications SET isRead = 1");
      return true;
    } catch (error) {
      console.error("Erro ao marcar todas as notificações como lidas:", error);
      return false;
    }
  }

  private async markAllNotificationsAsReadInStorage(): Promise<boolean> {
    try {
      const notifications = await this.getNotificationsFromStorage();
      notifications.forEach((notification) => {
        notification.isRead = 1;
      });
      await storageService.setItem(
        "sqlite_notifications",
        JSON.stringify(notifications)
      );
      return true;
    } catch (error) {
      console.error(
        "Erro ao marcar todas as notificações como lidas no storage:",
        error
      );
      return false;
    }
  }

  // Conta notificações não lidas
  async getUnreadNotificationsCount(): Promise<number> {
    try {
      if (this.isWeb) {
        const notifications = await this.getNotificationsFromStorage();
        return notifications.filter((n) => n.isRead === 0).length;
      }

      if (!this.db) throw new Error("Database not initialized");

      const result = await this.db.getFirstAsync(
        "SELECT COUNT(*) as count FROM notifications WHERE isRead = 0"
      );
      return result?.count || 0;
    } catch (error) {
      console.error("Erro ao contar notificações não lidas:", error);
      return 0;
    }
  }

  // ===== MÉTODOS DE ESTATÍSTICAS =====

  // Estatísticas de pedidos
  async getOrderStatistics(): Promise<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    favoriteRestaurant: string;
  }> {
    try {
      if (this.isWeb) {
        return await this.getOrderStatisticsFromStorage();
      }

      if (!this.db) throw new Error("Database not initialized");

      const totalOrdersResult = await this.db.getFirstAsync(
        "SELECT COUNT(*) as count FROM orders"
      );
      const totalSpentResult = await this.db.getFirstAsync(
        "SELECT SUM(totalAmount) as total FROM orders"
      );
      const averageResult = await this.db.getFirstAsync(
        "SELECT AVG(totalAmount) as average FROM orders"
      );
      const favoriteRestaurantResult = await this.db.getFirstAsync(
        "SELECT restaurantName, COUNT(*) as count FROM orders GROUP BY restaurantId ORDER BY count DESC LIMIT 1"
      );

      return {
        totalOrders: totalOrdersResult?.count || 0,
        totalSpent: totalSpentResult?.total || 0,
        averageOrderValue: averageResult?.average || 0,
        favoriteRestaurant:
          favoriteRestaurantResult?.restaurantName || "Nenhum",
      };
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      return {
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        favoriteRestaurant: "Nenhum",
      };
    }
  }

  private async getOrderStatisticsFromStorage(): Promise<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    favoriteRestaurant: string;
  }> {
    try {
      const orders = await this.getOrdersFromStorage();

      if (orders.length === 0) {
        return {
          totalOrders: 0,
          totalSpent: 0,
          averageOrderValue: 0,
          favoriteRestaurant: "Nenhum",
        };
      }

      const totalOrders = orders.length;
      const totalSpent = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );
      const averageOrderValue = totalSpent / totalOrders;

      // Encontrar restaurante favorito
      const restaurantCounts: { [key: string]: number } = {};
      orders.forEach((order) => {
        restaurantCounts[order.restaurantName] =
          (restaurantCounts[order.restaurantName] || 0) + 1;
      });

      const favoriteRestaurant =
        Object.entries(restaurantCounts).sort(
          ([, a], [, b]) => b - a
        )[0]?.[0] || "Nenhum";

      return {
        totalOrders,
        totalSpent,
        averageOrderValue,
        favoriteRestaurant,
      };
    } catch (error) {
      console.error("Erro ao buscar estatísticas do storage:", error);
      return {
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        favoriteRestaurant: "Nenhum",
      };
    }
  }

  // Histórico de consumo por mês
  async getMonthlySpending(
    months: number = 6
  ): Promise<Array<{ month: string; total: number }>> {
    try {
      if (this.isWeb) {
        return await this.getMonthlySpendingFromStorage(months);
      }

      if (!this.db) throw new Error("Database not initialized");

      const result = await this.db.getAllAsync(`
        SELECT 
          strftime('%Y-%m', orderDate) as month,
          SUM(totalAmount) as total
        FROM orders 
        WHERE orderDate >= date('now', '-${months} months')
        GROUP BY month
        ORDER BY month DESC
      `);

      return result as Array<{ month: string; total: number }>;
    } catch (error) {
      console.error("Erro ao buscar gastos mensais:", error);
      return [];
    }
  }

  private async getMonthlySpendingFromStorage(
    months: number = 6
  ): Promise<Array<{ month: string; total: number }>> {
    try {
      const orders = await this.getOrdersFromStorage();
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - months);

      const recentOrders = orders.filter(
        (order) => new Date(order.orderDate) >= cutoffDate
      );

      const monthlyData: { [key: string]: number } = {};

      recentOrders.forEach((order) => {
        const month = order.orderDate.substring(0, 7); // YYYY-MM
        monthlyData[month] = (monthlyData[month] || 0) + order.totalAmount;
      });

      return Object.entries(monthlyData)
        .map(([month, total]) => ({ month, total }))
        .sort((a, b) => b.month.localeCompare(a.month));
    } catch (error) {
      console.error("Erro ao buscar gastos mensais do storage:", error);
      return [];
    }
  }

  // ===== MÉTODOS DE MANUTENÇÃO =====

  // Limpa dados antigos
  async cleanupOldData(daysToKeep: number = 365): Promise<boolean> {
    try {
      if (this.isWeb) {
        return await this.cleanupOldDataFromStorage(daysToKeep);
      }

      if (!this.db) throw new Error("Database not initialized");

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      await this.db.runAsync("DELETE FROM orders WHERE orderDate < ?", [
        cutoffDate.toISOString(),
      ]);
      await this.db.runAsync("DELETE FROM reviews WHERE reviewDate < ?", [
        cutoffDate.toISOString(),
      ]);
      await this.db.runAsync("DELETE FROM notifications WHERE createdAt < ?", [
        cutoffDate.toISOString(),
      ]);

      return true;
    } catch (error) {
      console.error("Erro ao limpar dados antigos:", error);
      return false;
    }
  }

  private async cleanupOldDataFromStorage(
    daysToKeep: number = 365
  ): Promise<boolean> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      // Limpar pedidos antigos
      const orders = await this.getOrdersFromStorage();
      const recentOrders = orders.filter(
        (order) => new Date(order.orderDate) >= cutoffDate
      );
      await storageService.setItem(
        "sqlite_orders",
        JSON.stringify(recentOrders)
      );

      // Limpar avaliações antigas
      const reviews = await this.getReviewsFromStorage();
      const recentReviews = reviews.filter(
        (review) => new Date(review.reviewDate) >= cutoffDate
      );
      await storageService.setItem(
        "sqlite_reviews",
        JSON.stringify(recentReviews)
      );

      // Limpar notificações antigas
      const notifications = await this.getNotificationsFromStorage();
      const recentNotifications = notifications.filter(
        (notification) => new Date(notification.createdAt) >= cutoffDate
      );
      await storageService.setItem(
        "sqlite_notifications",
        JSON.stringify(recentNotifications)
      );

      return true;
    } catch (error) {
      console.error("Erro ao limpar dados antigos do storage:", error);
      return false;
    }
  }

  async clearAllData(): Promise<boolean> {
    try {
      if (this.isWeb) {
        await storageService.removeItem("sqlite_orders");
        await storageService.removeItem("sqlite_order_items");
        await storageService.removeItem("sqlite_reviews");
        await storageService.removeItem("sqlite_notifications");
        return true;
      }

      if (!this.db) throw new Error("Database not initialized");

      await this.db.runAsync("DELETE FROM order_items");
      await this.db.runAsync("DELETE FROM reviews");
      await this.db.runAsync("DELETE FROM notifications");
      await this.db.runAsync("DELETE FROM orders");

      return true;
    } catch (error) {
      console.error("Erro ao limpar todos os dados:", error);
      return false;
    }
  }

  // Exporta dados para backup
  async exportData(): Promise<{
    orders: OrderRecord[];
    orderItems: OrderItemRecord[];
    reviews: ReviewRecord[];
    notifications: NotificationRecord[];
  }> {
    try {
      if (this.isWeb) {
        const orders = await this.getOrdersFromStorage();
        const orderItems = await this.getOrderItemsFromStorage();
        const reviews = await this.getReviewsFromStorage();
        const notifications = await this.getNotificationsFromStorage();

        return { orders, orderItems, reviews, notifications };
      }

      if (!this.db) throw new Error("Database not initialized");

      const orders = (await this.db.getAllAsync(
        "SELECT * FROM orders"
      )) as OrderRecord[];
      const orderItems = (await this.db.getAllAsync(
        "SELECT * FROM order_items"
      )) as OrderItemRecord[];
      const reviews = (await this.db.getAllAsync(
        "SELECT * FROM reviews"
      )) as ReviewRecord[];
      const notifications = (await this.db.getAllAsync(
        "SELECT * FROM notifications"
      )) as NotificationRecord[];

      return { orders, orderItems, reviews, notifications };
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      return { orders: [], orderItems: [], reviews: [], notifications: [] };
    }
  }

  // Fecha a conexão com o banco
  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

// Instância singleton
export const databaseService = new DatabaseService();
