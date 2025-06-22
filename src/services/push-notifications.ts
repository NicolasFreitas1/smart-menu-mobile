import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import { storageService } from './storage';
import Constants from 'expo-constants';
import { APP_CONFIG } from '../config/app-config';
import { NOTIFICATION_STYLES, NOTIFICATION_SOUNDS, PRIORITY_CONFIG } from '../config/notification-config';

// Configuração personalizada das notificações
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    // Personalizar comportamento baseado no tipo de notificação
    const data = notification.request.content.data as any;
    const type = data?.type || 'default';
    
    switch (type) {
      case 'reservation_created':
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        };
      case 'reservation_reminder':
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        };
      case 'proximity':
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        };
      default:
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        };
    }
  },
});

class PushNotificationService {
  private expoPushToken: string | null = null;
  private notificationListener: Notifications.Subscription | null = null;
  private responseListener: Notifications.Subscription | null = null;

  // Inicializar serviço de notificações
  async initialize(): Promise<void> {
    try {
      console.log('🔔 Inicializando serviço de notificações...');
      
      // Verificar se o dispositivo suporta notificações
      if (!Device.isDevice) {
        console.log('📱 Dispositivo não suporta notificações push');
        return;
      }

      // Solicitar permissões
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('❌ Permissão de notificações negada');
        return;
      }

      // Registrar token
      await this.registerForPushNotifications();

      // Configurar listeners
      this.setupNotificationListeners();

      console.log('✅ Serviço de notificações inicializado');
    } catch (error) {
      console.error('❌ Erro ao inicializar notificações:', error);
      // Não falhar a inicialização do app se as notificações não funcionarem
    }
  }

  // Solicitar permissões
  private async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permissão Necessária',
          'Para receber notificações sobre pedidos e promoções, precisamos da permissão de notificações.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Configurações', onPress: () => this.openSettings() }
          ]
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      return false;
    }
  }

  // Abrir configurações do dispositivo
  private openSettings() {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Configurações',
        'Vá para Configurações > Notificações e ative as notificações para este app.'
      );
    } else {
      // No Android, o usuário pode ir manualmente para as configurações
      Alert.alert(
        'Configurações',
        'Vá para Configurações > Apps > Smart Menu Mobile > Notificações e ative as notificações.'
      );
    }
  }

  // Registrar para notificações push
  private async registerForPushNotifications(): Promise<void> {
    try {
      // Verificar se já temos um token salvo
      const savedToken = await storageService.getItem<string>('expo_push_token');
      if (savedToken) {
        this.expoPushToken = savedToken;
        console.log('📱 Token de notificação já registrado:', savedToken);
        return;
      }

      // Obter projectId do app.json
      const expoConfig = Constants.expoConfig as any;
      const projectId = expoConfig?.extra?.eas?.projectId || expoConfig?.projectId;

      if (!projectId || typeof projectId !== 'string') {
        console.error('❌ ProjectId não encontrado ou inválido no app.json');
        console.warn('⚠️ Verifique se o projectId está configurado corretamente');
        return;
      }

      console.log('🔧 Usando projectId:', projectId);

      // Tentar obter novo token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });

      if (token) {
        this.expoPushToken = token.data;
        await storageService.setItem('expo_push_token', token.data);
        console.log('✅ Token de notificação registrado:', token.data);
      }
    } catch (error) {
      console.error('❌ Erro ao registrar token de notificação:', error);
      
      // Se o erro for relacionado ao projectId, logar instruções específicas
      if (error instanceof Error && error.message.includes('projectId')) {
        console.warn('⚠️ Erro de projectId. Verifique:');
        console.warn('1. Se o projectId no app.json está correto');
        console.warn('2. Se você está logado no Expo CLI: expo login');
        console.warn('3. Se o projeto existe no Expo Dev Console');
        console.warn('4. Tente limpar o cache: expo start --clear');
      }
    }
  }

  // Configurar listeners de notificação
  private setupNotificationListeners(): void {
    // Listener para notificações recebidas
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('📨 Notificação recebida:', notification);
    });

    // Listener para respostas às notificações
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      this.handleNotificationResponse(response);
    });
  }

  // Manipular resposta à notificação
  private handleNotificationResponse(response: Notifications.NotificationResponse): void {
    const data = response.notification.request.content.data as Record<string, unknown>;
    
    console.log('👆 Resposta à notificação:', data);

    // Aqui você pode adicionar lógica específica baseada no tipo de notificação
    const type = data?.type as string;
    switch (type) {
      case 'order_update':
        // Navegar para tela de pedidos
        console.log('📋 Navegando para pedidos...');
        break;
      case 'promotion':
        // Navegar para promoções
        console.log('🎉 Navegando para promoções...');
        break;
      case 'reservation_reminder':
        // Navegar para reservas
        console.log('📅 Navegando para reservas...');
        break;
      default:
        console.log('📱 Notificação genérica');
    }
  }

  // Enviar notificação local
  async sendLocalNotification(notification: {
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: true,
          icon: APP_CONFIG.notification.icon,
        },
        trigger: null, // Enviar imediatamente
      });

      console.log('✅ Notificação local enviada');
    } catch (error) {
      console.error('❌ Erro ao enviar notificação local:', error);
    }
  }

  // Enviar notificação personalizada com ícone e cor
  async sendCustomNotification(notification: {
    title: string;
    body: string;
    type: 'reservation_created' | 'reservation_reminder' | 'proximity' | 'order_update' | 'promotion';
    data?: Record<string, unknown>;
    icon?: string;
    color?: string;
    sound?: boolean;
    priority?: 'default' | 'normal' | 'high';
  }): Promise<void> {
    try {
      const notificationContent = {
        title: notification.title,
        body: notification.body,
        data: {
          type: notification.type,
          ...notification.data,
        },
        sound: notification.sound ?? true,
        priority: notification.priority || 'default',
        // Usar ícone personalizado do app
        icon: APP_CONFIG.notification.icon,
        // Personalizações específicas por tipo
        ...this.getNotificationCustomization(notification.type),
      };

      await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: null, // Enviar imediatamente
      });

      console.log(`✅ Notificação personalizada enviada: ${notification.type}`);
    } catch (error) {
      console.error('❌ Erro ao enviar notificação personalizada:', error);
    }
  }

  // Obter personalização específica por tipo de notificação
  private getNotificationCustomization(type: string) {
    switch (type) {
      case 'reservation_created':
        return {
          // Som específico para reservas (se disponível)
          sound: 'notification_success.wav',
          // Badge para indicar nova reserva
          badge: 1,
        };
      case 'reservation_reminder':
        return {
          // Som de alerta para lembretes
          sound: 'notification_reminder.wav',
          // Prioridade alta para lembretes
          priority: 'high' as const,
        };
      case 'proximity':
        return {
          // Som suave para proximidade
          sound: 'notification_proximity.wav',
          // Sem badge para não poluir
          badge: 0,
        };
      case 'order_update':
        return {
          // Som de atualização
          sound: 'notification_update.wav',
          badge: 1,
        };
      case 'promotion':
        return {
          // Som de promoção
          sound: 'notification_promotion.wav',
          badge: 0,
        };
      default:
        return {
          sound: true,
          badge: 0,
        };
    }
  }

  // Enviar notificação agendada
  async scheduleNotification(notification: {
    title: string;
    body: string;
    data?: Record<string, unknown>;
    trigger: Notifications.NotificationTriggerInput;
  }): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: true,
          icon: APP_CONFIG.notification.icon,
        },
        trigger: notification.trigger,
      });

      console.log('✅ Notificação agendada');
    } catch (error) {
      console.error('❌ Erro ao agendar notificação:', error);
    }
  }

  // Enviar notificação push (requer servidor)
  async sendPushNotification(notification: {
    title: string;
    body: string;
    data?: Record<string, unknown>;
    to?: string;
  }): Promise<void> {
    try {
      if (!this.expoPushToken) {
        console.warn('⚠️ Token de notificação não disponível');
        return;
      }

      const message = {
        to: notification.to || this.expoPushToken,
        sound: 'default',
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
      };

      // Aqui você faria uma requisição para o servidor Expo
      // Por enquanto, vamos apenas logar
      console.log('📤 Enviando notificação push:', message);
      
      // Exemplo de como seria a requisição:
      // await fetch('https://exp.host/--/api/v2/push/send', {
      //   method: 'POST',
      //   headers: {
      //     Accept: 'application/json',
      //     'Accept-encoding': 'gzip, deflate',
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(message),
      // });
    } catch (error) {
      console.error('❌ Erro ao enviar notificação push:', error);
    }
  }

  // Obter token atual
  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  // Limpar todas as notificações
  async clearAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
      console.log('🗑️ Todas as notificações limpas');
    } catch (error) {
      console.error('❌ Erro ao limpar notificações:', error);
    }
  }

  // Cancelar notificações específicas
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('❌ Notificação cancelada:', notificationId);
    } catch (error) {
      console.error('❌ Erro ao cancelar notificação:', error);
    }
  }

  // Limpar listeners
  cleanup(): void {
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    if (this.responseListener) {
      this.responseListener.remove();
    }
  }

  // Enviar lembrete de reserva
  async sendReservationReminder(
    restaurantName: string,
    time: string,
    reservationId: string
  ): Promise<void> {
    try {
      await this.sendCustomNotification({
        title: 'Lembrete de Reserva ⏰',
        body: `Sua reserva no ${restaurantName} está marcada para ${time}. Não se esqueça!`,
        type: 'reservation_reminder',
        data: {
          reservationId,
          restaurantName,
          time,
        },
        priority: 'high',
      });

      console.log('✅ Lembrete de reserva enviado');
    } catch (error) {
      console.error('❌ Erro ao enviar lembrete de reserva:', error);
    }
  }

  // Enviar notificação de proximidade
  async sendProximityNotification(
    restaurantName: string,
    message: string
  ): Promise<void> {
    try {
      await this.sendCustomNotification({
        title: `Promoção - ${restaurantName} 🎉`,
        body: message,
        type: 'proximity',
        data: {
          restaurantName,
        },
        priority: 'normal',
      });

      console.log('✅ Notificação de proximidade enviada');
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de proximidade:', error);
    }
  }

  // Enviar notificação de reserva criada
  async sendReservationCreatedNotification(
    restaurantName: string,
    date: string,
    time: string,
    reservationId: string
  ): Promise<void> {
    try {
      await this.sendCustomNotification({
        title: 'Reserva Criada com Sucesso! 🎉',
        body: `Sua reserva no ${restaurantName} para ${date} às ${time} foi criada e adicionada ao seu calendário.`,
        type: 'reservation_created',
        data: {
          reservationId,
          restaurantName,
          date,
          time,
        },
        priority: 'high',
      });

      console.log('✅ Notificação de reserva criada enviada');
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de reserva criada:', error);
    }
  }

  // Enviar notificação de atualização de pedido
  async sendOrderUpdateNotification(
    orderId: string,
    status: string,
    restaurantName: string
  ): Promise<void> {
    try {
      const statusMessages = {
        confirmed: 'foi confirmado',
        preparing: 'está sendo preparado',
        ready: 'está pronto para retirada',
        delivered: 'foi entregue',
        cancelled: 'foi cancelado',
      };

      const message = statusMessages[status as keyof typeof statusMessages] || 'foi atualizado';

      await this.sendCustomNotification({
        title: 'Atualização do Pedido 📋',
        body: `Seu pedido no ${restaurantName} ${message}.`,
        type: 'order_update',
        data: {
          orderId,
          status,
          restaurantName,
        },
        priority: 'normal',
      });

      console.log('✅ Notificação de atualização de pedido enviada');
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de pedido:', error);
    }
  }

  // Enviar notificação de promoção
  async sendPromotionNotification(
    title: string,
    message: string,
    promotionData?: any
  ): Promise<void> {
    try {
      await this.sendCustomNotification({
        title: `Promoção Especial! ${title}`,
        body: message,
        type: 'promotion',
        data: {
          promotionData,
        },
        priority: 'normal',
      });

      console.log('✅ Notificação de promoção enviada');
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de promoção:', error);
    }
  }
}

export const pushNotificationService = new PushNotificationService(); 