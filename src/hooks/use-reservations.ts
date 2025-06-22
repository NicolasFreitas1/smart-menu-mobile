import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { Reservation } from '../types/assistant';
import { reservationService } from '../services/reservation';
import { pushNotificationService } from '../services/push-notifications';

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para agendar lembretes de reserva
  const scheduleReservationReminders = useCallback(async (reservation: Reservation) => {
    try {
      // Calcular datas para lembretes
      const [day, month, year] = reservation.date.split('/').map(Number);
      const [hour, minute] = reservation.time.split(':').map(Number);
      const reservationDate = new Date(year, month - 1, day, hour, minute);
      
      // Lembrete 1 dia antes
      const oneDayBefore = new Date(reservationDate.getTime() - 24 * 60 * 60 * 1000);
      if (oneDayBefore > new Date()) {
        await pushNotificationService.scheduleNotification({
          title: 'Lembrete de Reserva - Amanhã 📅',
          body: `Sua reserva no ${reservation.restaurantName} está marcada para amanhã às ${reservation.time}.`,
          data: { 
            type: 'reservation_reminder',
            reservationId: reservation.id,
            restaurantName: reservation.restaurantName,
            time: reservation.time
          },
          trigger: { 
            type: 'date',
            date: oneDayBefore 
          }
        });
      }

      // Lembrete 1 hora antes
      const oneHourBefore = new Date(reservationDate.getTime() - 60 * 60 * 1000);
      if (oneHourBefore > new Date()) {
        await pushNotificationService.scheduleNotification({
          title: 'Lembrete de Reserva - 1 Hora 📅',
          body: `Sua reserva no ${reservation.restaurantName} está marcada para daqui 1 hora às ${reservation.time}.`,
          data: { 
            type: 'reservation_reminder',
            reservationId: reservation.id,
            restaurantName: reservation.restaurantName,
            time: reservation.time
          },
          trigger: { 
            type: 'date',
            date: oneHourBefore 
          }
        });
      }

      // Lembrete 15 minutos antes
      const fifteenMinutesBefore = new Date(reservationDate.getTime() - 15 * 60 * 1000);
      if (fifteenMinutesBefore > new Date()) {
        await pushNotificationService.scheduleNotification({
          title: 'Lembrete de Reserva - 15 Minutos 📅',
          body: `Sua reserva no ${reservation.restaurantName} está marcada para daqui 15 minutos às ${reservation.time}.`,
          data: { 
            type: 'reservation_reminder',
            reservationId: reservation.id,
            restaurantName: reservation.restaurantName,
            time: reservation.time
          },
          trigger: { 
            type: 'date',
            date: fifteenMinutesBefore 
          }
        });
      }
    } catch (error) {
      console.error('Erro ao agendar lembretes de reserva:', error);
    }
  }, []);

  // Carregar reservas
  const loadReservations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Carregando reservas...');
      const userReservations = await reservationService.getUserReservations();
      console.log('📋 Reservas carregadas:', userReservations.length);
      console.log('📋 Detalhes das reservas:', userReservations);
      setReservations(userReservations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar reservas');
      console.error('❌ Erro ao carregar reservas:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Criar nova reserva
  const createReservation = useCallback(async (
    reservationData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Reservation | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Criando reserva:', reservationData);
      const newReservation = await reservationService.createReservation(reservationData);
      console.log('✅ Reserva criada:', newReservation);
      
      // Recarregar reservas do storage em vez de atualizar estado local
      await loadReservations();

      // Enviar notificação de sucesso
      await pushNotificationService.sendReservationCreatedNotification(
        newReservation.restaurantName,
        newReservation.date,
        newReservation.time,
        newReservation.id
      );

      // Agendar lembretes automáticos
      await scheduleReservationReminders(newReservation);

      Alert.alert(
        'Reserva Criada',
        `Sua reserva no ${newReservation.restaurantName} foi criada com sucesso!`,
        [{ text: 'OK' }]
      );

      return newReservation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar reserva';
      setError(errorMessage);
      console.error('❌ Erro ao criar reserva:', err);
      Alert.alert('Erro', errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadReservations, scheduleReservationReminders]);

  // Cancelar reserva
  const cancelReservation = useCallback(async (reservationId: string): Promise<boolean> => {
    try {
      console.log('🔄 Cancelando reserva:', reservationId);
      const success = await reservationService.cancelReservation(reservationId);
      
      if (success) {
        console.log('✅ Reserva cancelada com sucesso');
        // Recarregar reservas do storage
        await loadReservations();

        Alert.alert('Reserva Cancelada', 'Sua reserva foi cancelada com sucesso.');
        return true;
      } else {
        console.log('❌ Falha ao cancelar reserva');
        Alert.alert('Erro', 'Não foi possível cancelar a reserva.');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar reserva';
      setError(errorMessage);
      console.error('❌ Erro ao cancelar reserva:', err);
      Alert.alert('Erro', errorMessage);
      return false;
    }
  }, [loadReservations]);

  // Atualizar status da reserva
  const updateReservationStatus = useCallback(async (
    reservationId: string,
    status: Reservation['status']
  ): Promise<boolean> => {
    try {
      console.log('🔄 Atualizando status da reserva:', reservationId, 'para:', status);
      const success = await reservationService.updateReservationStatus(reservationId, status);
      
      if (success) {
        console.log('✅ Status atualizado com sucesso');
        // Recarregar reservas do storage
        await loadReservations();
        return true;
      }
      console.log('❌ Falha ao atualizar status');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar reserva');
      console.error('❌ Erro ao atualizar status:', err);
      return false;
    }
  }, [loadReservations]);

  // Buscar reservas próximas
  const getUpcomingReservations = useCallback(async (): Promise<Reservation[]> => {
    try {
      return await reservationService.getUpcomingReservations();
    } catch (err) {
      console.error('Erro ao buscar reservas próximas:', err);
      return [];
    }
  }, []);

  // Solicitar permissão do calendário
  const requestCalendarPermission = useCallback(async (): Promise<boolean> => {
    try {
      return await reservationService.requestCalendarPermission();
    } catch (err) {
      console.error('Erro ao solicitar permissão do calendário:', err);
      return false;
    }
  }, []);

  // Filtrar reservas por status
  const getReservationsByStatus = useCallback((status: Reservation['status']) => {
    return reservations.filter(reservation => reservation.status === status);
  }, [reservations]);

  // Filtrar reservas por restaurante
  const getReservationsByRestaurant = useCallback((restaurantId: string) => {
    return reservations.filter(reservation => reservation.restaurantId === restaurantId);
  }, [reservations]);

  // Carregar reservas na inicialização
  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  return {
    // State
    reservations,
    isLoading,
    error,
    
    // Actions
    loadReservations,
    createReservation,
    cancelReservation,
    updateReservationStatus,
    getUpcomingReservations,
    requestCalendarPermission,
    
    // Filters
    getReservationsByStatus,
    getReservationsByRestaurant,
    
    // Computed
    confirmedReservations: getReservationsByStatus('confirmed'),
    pendingReservations: getReservationsByStatus('pending'),
    cancelledReservations: getReservationsByStatus('cancelled'),
    completedReservations: getReservationsByStatus('completed'),
  };
}; 