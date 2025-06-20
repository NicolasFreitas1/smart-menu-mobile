import { useState, useEffect, useCallback } from "react";
import { databaseService } from "../services/database";

// Tipos para compatibilidade
interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: number;
  createdAt: string;
  data?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar notificações
  const loadNotifications = useCallback(
    async (limit: number = 50, offset: number = 0) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await databaseService.getNotifications(limit, offset);
        setNotifications(result);

        // Atualizar contagem de não lidas
        const unread = await databaseService.getUnreadNotificationsCount();
        setUnreadCount(unread);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar notificações"
        );
        console.error("Erro ao carregar notificações:", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Salvar notificação
  const saveNotification = useCallback(
    async (notification: NotificationRecord): Promise<boolean> => {
      try {
        const success = await databaseService.saveNotification(notification);
        if (success) {
          // Recarregar notificações após salvar
          await loadNotifications();
        }
        return success;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao salvar notificação"
        );
        console.error("Erro ao salvar notificação:", err);
        return false;
      }
    },
    [loadNotifications]
  );

  // Marcar como lida
  const markAsRead = useCallback(
    async (notificationId: string): Promise<boolean> => {
      try {
        const success = await databaseService.markNotificationAsRead(
          notificationId
        );
        if (success) {
          // Recarregar notificações após marcar como lida
          await loadNotifications();
        }
        return success;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao marcar notificação como lida"
        );
        console.error("Erro ao marcar notificação como lida:", err);
        return false;
      }
    },
    [loadNotifications]
  );

  // Marcar todas como lidas
  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    try {
      const success = await databaseService.markAllNotificationsAsRead();
      if (success) {
        // Recarregar notificações após marcar todas como lidas
        await loadNotifications();
      }
      return success;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao marcar todas as notificações como lidas"
      );
      console.error("Erro ao marcar todas as notificações como lidas:", err);
      return false;
    }
  }, [loadNotifications]);

  // Criar notificação de atualização de pedido
  const createOrderUpdateNotification = useCallback(
    async (
      orderId: string,
      status: string,
      restaurantName: string
    ): Promise<boolean> => {
      const notification: NotificationRecord = {
        id: `order-${orderId}-${Date.now()}`,
        title: "Atualização do Pedido",
        message: `Seu pedido no ${restaurantName} foi ${status}`,
        type: "order_update",
        isRead: 0,
        createdAt: new Date().toISOString(),
        data: JSON.stringify({ orderId, status, restaurantName }),
      };

      return await saveNotification(notification);
    },
    [saveNotification]
  );

  // Criar notificação de promoção
  const createPromotionNotification = useCallback(
    async (title: string, message: string, data?: any): Promise<boolean> => {
      const notification: NotificationRecord = {
        id: `promotion-${Date.now()}`,
        title,
        message,
        type: "promotion",
        isRead: 0,
        createdAt: new Date().toISOString(),
        data: data ? JSON.stringify(data) : undefined,
      };

      return await saveNotification(notification);
    },
    [saveNotification]
  );

  // Criar notificação de lembrete
  const createReminderNotification = useCallback(
    async (title: string, message: string, data?: any): Promise<boolean> => {
      const notification: NotificationRecord = {
        id: `reminder-${Date.now()}`,
        title,
        message,
        type: "reminder",
        isRead: 0,
        createdAt: new Date().toISOString(),
        data: data ? JSON.stringify(data) : undefined,
      };

      return await saveNotification(notification);
    },
    [saveNotification]
  );

  // Criar notificação do sistema
  const createSystemNotification = useCallback(
    async (title: string, message: string, data?: any): Promise<boolean> => {
      const notification: NotificationRecord = {
        id: `system-${Date.now()}`,
        title,
        message,
        type: "system",
        isRead: 0,
        createdAt: new Date().toISOString(),
        data: data ? JSON.stringify(data) : undefined,
      };

      return await saveNotification(notification);
    },
    [saveNotification]
  );

  // Buscar notificações por tipo
  const getNotificationsByType = useCallback(
    async (type: string): Promise<NotificationRecord[]> => {
      try {
        const allNotifications = await databaseService.getNotifications();
        return allNotifications.filter(
          (notification) => notification.type === type
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao buscar notificações por tipo"
        );
        console.error("Erro ao buscar notificações por tipo:", err);
        return [];
      }
    },
    []
  );

  // Buscar notificações não lidas
  const getUnreadNotifications = useCallback(async (): Promise<
    NotificationRecord[]
  > => {
    try {
      const allNotifications = await databaseService.getNotifications();
      return allNotifications.filter(
        (notification) => notification.isRead === 0
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao buscar notificações não lidas"
      );
      console.error("Erro ao buscar notificações não lidas:", err);
      return [];
    }
  }, []);

  // Carregar notificações na inicialização
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    loadNotifications,
    saveNotification,
    markAsRead,
    markAllAsRead,
    createOrderUpdateNotification,
    createPromotionNotification,
    createReminderNotification,
    createSystemNotification,
    getNotificationsByType,
    getUnreadNotifications,
  };
};
