import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import { storageService } from './storage';
import Constants from 'expo-constants';

// Configurar comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
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
        },
        trigger: null, // Enviar imediatamente
      });

      console.log('✅ Notificação local enviada');
    } catch (error) {
      console.error('❌ Erro ao enviar notificação local:', error);
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
      await this.sendLocalNotification({
        title: 'Lembrete de Reserva',
        body: `Sua reserva no ${restaurantName} está marcada para ${time}. Não se esqueça!`,
        data: {
          type: 'reservation_reminder',
          reservationId,
          restaurantName,
          time,
        },
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
      await this.sendLocalNotification({
        title: `Promoção - ${restaurantName}`,
        body: message,
        data: {
          type: 'proximity',
          restaurantName,
        },
      });

      console.log('✅ Notificação de proximidade enviada');
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de proximidade:', error);
    }
  }
}

export const pushNotificationService = new PushNotificationService(); 