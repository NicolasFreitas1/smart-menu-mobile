import { pushNotificationService } from '../services/push-notifications';
import { NOTIFICATION_STYLES, TEST_CONFIG } from '../config/notification-config';

/**
 * Utilitário para testar notificações agendadas
 */
export class NotificationTester {
  
  /**
   * Testar notificação imediata
   */
  static async testImmediateNotification(): Promise<void> {
    try {
      await pushNotificationService.sendNotification({
        title: 'Teste de Notificação 🧪',
        body: 'Esta é uma notificação de teste imediata',
        type: 'promotion',
        data: { test: true }
      });
      console.log('✅ Notificação imediata enviada');
    } catch (error) {
      console.error('❌ Erro ao enviar notificação imediata:', error);
    }
  }

  /**
   * Testar notificação agendada para 5 segundos
   */
  static async testScheduledNotification(): Promise<void> {
    try {
      const fiveSecondsFromNow = new Date(Date.now() + 5 * 1000);
      
      await pushNotificationService.scheduleNotification({
        title: 'Teste Agendado ⏰',
        body: 'Esta notificação foi agendada para 5 segundos',
        data: { test: true, scheduled: true },
        trigger: { 
          type: 'date',
          date: fiveSecondsFromNow 
        }
      });
      
      console.log('✅ Notificação agendada para 5 segundos');
    } catch (error) {
      console.error('❌ Erro ao agendar notificação:', error);
    }
  }

  /**
   * Testar notificação de reserva completa
   */
  static async testReservationNotification(): Promise<void> {
    try {
      const oneMinuteFromNow = new Date(Date.now() + 60 * 1000);
      const twoMinutesFromNow = new Date(Date.now() + 2 * 60 * 1000);

      // Notificação de reserva criada
      await pushNotificationService.sendReservationCreatedNotification(
        'Restaurante Teste',
        '25/12/2024',
        '19:00'
      );

      // Notificação de lembrete de reserva
      await pushNotificationService.scheduleNotification({
        title: 'Lembrete de Reserva - Teste 📅',
        body: 'Sua reserva de teste está marcada para daqui 1 minuto',
        data: { 
          type: 'reservation_reminder',
          test: true 
        },
        trigger: { 
          type: 'date',
          date: oneMinuteFromNow 
        }
      });

      // Notificação de lembrete de reserva 2
      await pushNotificationService.scheduleNotification({
        title: 'Lembrete de Reserva - Teste 2 📅',
        body: 'Sua reserva de teste está marcada para daqui 2 minutos',
        data: { 
          type: 'reservation_reminder',
          test: true 
        },
        trigger: { 
          type: 'date',
          date: twoMinutesFromNow 
        }
      });

      console.log('✅ Notificações de reserva testadas');
    } catch (error) {
      console.error('❌ Erro ao testar notificações de reserva:', error);
    }
  }

  /**
   * Testar notificação de proximidade
   */
  static async testProximityNotification(): Promise<void> {
    try {
      await pushNotificationService.sendProximityNotification(
        'Restaurante Teste',
        'Você está próximo do Restaurante Teste! Que tal fazer uma reserva ou pedir delivery?'
      );
      console.log('✅ Notificação de proximidade enviada');
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de proximidade:', error);
    }
  }

  /**
   * Testar notificação de pedido
   */
  static async testOrderNotification(): Promise<void> {
    try {
      await pushNotificationService.sendOrderUpdateNotification(
        'test-order-123',
        'confirmed',
        'Restaurante Teste'
      );
      console.log('✅ Notificação de pedido enviada');
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de pedido:', error);
    }
  }

  /**
   * Testar notificação de promoção
   */
  static async testPromotionNotification(): Promise<void> {
    try {
      await pushNotificationService.sendPromotionNotification(
        'Black Friday',
        '20% de desconto em todos os pratos hoje!',
        { discount: 20, validUntil: '2024-12-31' }
      );
      console.log('✅ Notificação de promoção enviada');
    } catch (error) {
      console.error('❌ Erro ao enviar notificação de promoção:', error);
    }
  }

  /**
   * Testar todos os tipos de notificação
   */
  static async testAllNotifications(): Promise<void> {
    console.log('🧪 Iniciando testes de notificação...');
    
    await this.testImmediateNotification();
    await this.testScheduledNotification();
    await this.testReservationNotification();
    await this.testProximityNotification();
    await this.testOrderNotification();
    await this.testPromotionNotification();
    
    console.log('✅ Todos os testes de notificação concluídos');
  }

  /**
   * Limpar todas as notificações agendadas
   */
  static async clearAllScheduledNotifications(): Promise<void> {
    try {
      await pushNotificationService.clearAllNotifications();
      console.log('✅ Todas as notificações agendadas foram limpas');
    } catch (error) {
      console.error('❌ Erro ao limpar notificações:', error);
    }
  }

  /**
   * Testar estilos específicos de notificação
   */
  static async testNotificationStyles(): Promise<void> {
    try {
      const styles = Object.keys(NOTIFICATION_STYLES);
      
      for (const style of styles) {
        await pushNotificationService.sendCustomNotification({
          title: `Teste de Estilo: ${style}`,
          body: `Esta é uma notificação de teste para o estilo ${style}`,
          type: style as any,
          data: { testStyle: style },
        });
        
        // Aguardar 1 segundo entre cada teste
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.log('✅ Testes de estilo de notificação concluídos');
    } catch (error) {
      console.error('❌ Erro ao testar estilos de notificação:', error);
    }
  }
} 