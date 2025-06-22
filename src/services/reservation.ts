import { Platform, Alert } from 'react-native';
import * as Calendar from 'expo-calendar';
import { Reservation } from '../types/assistant';
import { databaseService } from './database';

class ReservationService {
  private hasCalendarPermission = false;

  // Solicitar permissão do calendário
  async requestCalendarPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        console.log('Web não suporta calendário');
        return false;
      }

      const { status } = await Calendar.requestCalendarPermissionsAsync();
      
      if (status === 'granted') {
        this.hasCalendarPermission = true;
        console.log('✅ Permissão do calendário concedida');
        return true;
      } else {
        console.log('❌ Permissão do calendário negada');
        this.openSettings();
        return false;
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão do calendário:', error);
      return false;
    }
  }

  // Abrir configurações do dispositivo
  private openSettings() {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Configurações',
        'Vá para Configurações > Privacidade e Segurança > Calendário e ative o acesso para este app.'
      );
    } else {
      Alert.alert(
        'Configurações',
        'Vá para Configurações > Apps > Smart Menu > Permissões e ative o acesso ao calendário.'
      );
    }
  }

  // Criar uma nova reserva
  async createReservation(reservationData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reservation> {
    try {
      console.log('🔄 ReservationService: Iniciando criação de reserva');
      console.log('📋 ReservationService: Dados recebidos:', reservationData);

      // Validar formato da data e hora
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
      
      if (!dateRegex.test(reservationData.date)) {
        throw new Error('Formato de data inválido. Use DD/MM/AAAA');
      }
      
      if (!timeRegex.test(reservationData.time)) {
        throw new Error('Formato de hora inválido. Use HH:MM');
      }
      
      if (!phoneRegex.test(reservationData.customerPhone)) {
        throw new Error('Formato de telefone inválido. Use (XX) XXXXX-XXXX');
      }
      
      // Validar se a data é válida
      const [day, month, year] = reservationData.date.split('/').map(Number);
      const testDate = new Date(year, month - 1, day);
      
      if (isNaN(testDate.getTime()) || 
          testDate.getFullYear() !== year || 
          testDate.getMonth() !== month - 1 || 
          testDate.getDate() !== day) {
        throw new Error('Data inválida');
      }

      console.log('✅ ReservationService: Validações passaram');

      const reservation: Reservation = {
        ...reservationData,
        id: `reservation-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('📋 ReservationService: Reserva criada:', reservation);

      // Salvar no banco de dados
      console.log('💾 ReservationService: Salvando no banco...');
      const saved = await databaseService.saveReservation(reservation);
      
      if (!saved) {
        throw new Error('Falha ao salvar reserva no banco de dados');
      }
      
      console.log('✅ ReservationService: Reserva salva no banco');

      // Adicionar ao calendário se tiver permissão
      if (this.hasCalendarPermission) {
        console.log('📅 ReservationService: Adicionando ao calendário...');
        await this.addToCalendar(reservation);
      }

      console.log('✅ ReservationService: Reserva criada com sucesso');
      return reservation;
    } catch (error) {
      console.error('❌ ReservationService: Erro ao criar reserva:', error);
      throw new Error('Não foi possível criar a reserva');
    }
  }

  // Adicionar reserva ao calendário
  private async addToCalendar(reservation: Reservation): Promise<void> {
    try {
      // Buscar calendários disponíveis
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];

      if (!defaultCalendar) {
        throw new Error('Nenhum calendário disponível');
      }

      // Validar e formatar a data e hora
      const [day, month, year] = reservation.date.split('/').map(Number);
      const [hour, minute] = reservation.time.split(':').map(Number);
      
      // Validar se os valores são válidos
      if (!day || !month || !year || hour === undefined || minute === undefined) {
        throw new Error('Data ou hora inválida');
      }
      
      // Criar data com validação
      const eventDate = new Date(year, month - 1, day, hour, minute);
      
      // Verificar se a data é válida
      if (isNaN(eventDate.getTime())) {
        throw new Error('Data inválida');
      }
      
      const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000); // 2 horas de duração

      const eventDetails = {
        title: `Reserva - ${reservation.restaurantName}`,
        startDate: eventDate,
        endDate: endDate,
        location: reservation.restaurantName,
        notes: `Reserva para ${reservation.partySize} pessoas${reservation.specialRequests ? `\n\nPedidos especiais: ${reservation.specialRequests}` : ''}`,
        alarms: [
          { relativeOffset: -60 }, // 1 hora antes
          { relativeOffset: -15 }, // 15 minutos antes
        ],
      };

      await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
      
      console.log('✅ Reserva adicionada ao calendário com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar ao calendário:', error);
      // Não falhar a reserva se não conseguir adicionar ao calendário
    }
  }

  // Buscar reservas do usuário
  async getUserReservations(): Promise<Reservation[]> {
    try {
      console.log('🔄 Buscando reservas do usuário...');
      const reservations = await databaseService.getReservations();
      console.log('📋 Reservas encontradas:', reservations.length);
      
      // Converter ReservationRecord para Reservation
      return reservations.map(record => ({
        ...record,
        status: record.status as "pending" | "confirmed" | "cancelled" | "completed"
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar reservas:', error);
      return [];
    }
  }

  // Atualizar status de uma reserva
  async updateReservationStatus(reservationId: string, status: Reservation['status']): Promise<boolean> {
    try {
      console.log('🔄 ReservationService: Atualizando status da reserva:', reservationId, 'para:', status);
      const success = await databaseService.updateReservationStatus(reservationId, status);
      console.log('✅ ReservationService: Status atualizado com sucesso');
      return success;
    } catch (error) {
      console.error('❌ ReservationService: Erro ao atualizar status da reserva:', error);
      return false;
    }
  }

  // Cancelar reserva
  async cancelReservation(reservationId: string): Promise<boolean> {
    return await this.updateReservationStatus(reservationId, 'cancelled');
  }

  // Verificar se tem reservas próximas (próximas 24h)
  async getUpcomingReservations(): Promise<Reservation[]> {
    try {
      console.log('🔍 ReservationService: Buscando reservas próximas...');
      const reservations = await databaseService.getUpcomingReservations();
      console.log('📋 ReservationService: Reservas próximas encontradas:', reservations.length);
      return reservations.map(record => ({
        ...record,
        status: record.status as "pending" | "confirmed" | "cancelled" | "completed"
      }));
    } catch (error) {
      console.error('❌ ReservationService: Erro ao buscar reservas próximas:', error);
      return [];
    }
  }

  // Buscar reservas por status
  async getReservationsByStatus(status: Reservation['status']): Promise<Reservation[]> {
    try {
      console.log('🔍 ReservationService: Buscando reservas por status:', status);
      const reservations = await databaseService.getReservationsByStatus(status);
      console.log('📋 ReservationService: Reservas encontradas:', reservations.length);
      return reservations.map(record => ({
        ...record,
        status: record.status as "pending" | "confirmed" | "cancelled" | "completed"
      }));
    } catch (error) {
      console.error('❌ ReservationService: Erro ao buscar reservas por status:', error);
      return [];
    }
  }

  // Buscar reservas por restaurante
  async getReservationsByRestaurant(restaurantId: string): Promise<Reservation[]> {
    try {
      console.log('🔍 ReservationService: Buscando reservas por restaurante:', restaurantId);
      const reservations = await databaseService.getReservationsByRestaurant(restaurantId);
      console.log('📋 ReservationService: Reservas encontradas:', reservations.length);
      return reservations.map(record => ({
        ...record,
        status: record.status as "pending" | "confirmed" | "cancelled" | "completed"
      }));
    } catch (error) {
      console.error('❌ ReservationService: Erro ao buscar reservas por restaurante:', error);
      return [];
    }
  }

  // Deletar reserva
  async deleteReservation(reservationId: string): Promise<boolean> {
    try {
      console.log('🗑️ ReservationService: Deletando reserva:', reservationId);
      const success = await databaseService.deleteReservation(reservationId);
      console.log('✅ ReservationService: Reserva deletada com sucesso');
      return success;
    } catch (error) {
      console.error('❌ ReservationService: Erro ao deletar reserva:', error);
      return false;
    }
  }
}

export const reservationService = new ReservationService(); 