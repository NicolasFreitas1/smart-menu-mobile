import { storageService } from '../services/storage';

/**
 * Utilitário para limpar dados corrompidos do storage
 */
export class StorageCleanup {
  
  /**
   * Limpar todos os dados de cache relacionados à sincronização offline
   */
  static async clearOfflineCache(): Promise<void> {
    try {
      console.log('🧹 Iniciando limpeza do cache offline...');
      
      const keysToRemove = [
        'cached_restaurants',
        'cached_dishes', 
        'cached_categories',
        'offline_sync_data',
        'reservations',
        'geofence_events',
        'expo_push_token'
      ];

      for (const key of keysToRemove) {
        try {
          await storageService.removeItem(key);
          console.log(`✅ Removido: ${key}`);
        } catch (error) {
          console.warn(`⚠️ Erro ao remover ${key}:`, error);
        }
      }

      console.log('✅ Cache offline limpo com sucesso');
    } catch (error) {
      console.error('❌ Erro ao limpar cache offline:', error);
    }
  }

  /**
   * Verificar e corrigir dados corrompidos
   */
  static async validateAndFixData(): Promise<void> {
    try {
      console.log('🔍 Verificando dados do storage...');
      
      const keysToValidate = [
        'cached_restaurants',
        'cached_dishes',
        'cached_categories', 
        'offline_sync_data',
        'reservations',
        'geofence_events'
      ];

      for (const key of keysToValidate) {
        try {
          const data = await storageService.getItem(key);
          if (data !== null) {
            console.log(`✅ ${key}: dados válidos`);
          } else {
            console.log(`ℹ️ ${key}: sem dados`);
          }
        } catch (error) {
          console.warn(`⚠️ ${key}: dados corrompidos, removendo...`);
          await storageService.removeItem(key);
        }
      }

      console.log('✅ Validação concluída');
    } catch (error) {
      console.error('❌ Erro na validação:', error);
    }
  }

  /**
   * Reinicializar dados padrão
   */
  static async initializeDefaultData(): Promise<void> {
    try {
      console.log('🔄 Inicializando dados padrão...');
      
      // Dados padrão para sincronização offline
      const defaultSyncData = {
        lastSync: null,
        dishes: [],
        categories: [],
        restaurants: [],
        pendingActions: [],
      };

      await storageService.setItem('offline_sync_data', defaultSyncData);
      
      // Arrays vazios para cache
      await storageService.setItem('cached_restaurants', []);
      await storageService.setItem('cached_dishes', []);
      await storageService.setItem('cached_categories', []);
      await storageService.setItem('reservations', []);
      await storageService.setItem('geofence_events', []);

      console.log('✅ Dados padrão inicializados');
    } catch (error) {
      console.error('❌ Erro ao inicializar dados padrão:', error);
    }
  }

  /**
   * Limpeza completa do storage
   */
  static async fullCleanup(): Promise<void> {
    try {
      console.log('🧹 Iniciando limpeza completa...');
      
      // 1. Limpar cache offline
      await this.clearOfflineCache();
      
      // 2. Validar e corrigir dados
      await this.validateAndFixData();
      
      // 3. Inicializar dados padrão
      await this.initializeDefaultData();
      
      console.log('✅ Limpeza completa concluída');
    } catch (error) {
      console.error('❌ Erro na limpeza completa:', error);
    }
  }

  /**
   * Verificar tamanho do storage
   */
  static async checkStorageSize(): Promise<void> {
    try {
      const info = await storageService.getStorageInfo();
      if (info) {
        const usedMB = (info.used / 1024 / 1024).toFixed(2);
        const totalMB = (info.total / 1024 / 1024).toFixed(2);
        const percentage = ((info.used / info.total) * 100).toFixed(1);
        
        console.log(`📊 Storage: ${usedMB}MB / ${totalMB}MB (${percentage}%)`);
        
        if (info.used > info.total * 0.8) {
          console.warn('⚠️ Storage quase cheio, considere limpar dados antigos');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar tamanho do storage:', error);
    }
  }

  /**
   * Backup dos dados importantes
   */
  static async backupImportantData(): Promise<any> {
    try {
      console.log('💾 Fazendo backup dos dados importantes...');
      
      const backup = {
        theme: await storageService.getTheme(),
        cart: await storageService.getCart(),
        user: await storageService.getUser(),
        userPreferences: await storageService.getUserPreferences(),
        selectedRestaurant: await storageService.getSelectedRestaurant(),
        timestamp: new Date().toISOString(),
      };

      console.log('✅ Backup concluído');
      return backup;
    } catch (error) {
      console.error('❌ Erro no backup:', error);
      return null;
    }
  }

  /**
   * Restaurar dados do backup
   */
  static async restoreFromBackup(backup: any): Promise<void> {
    try {
      console.log('🔄 Restaurando dados do backup...');
      
      if (backup.theme) await storageService.setTheme(backup.theme);
      if (backup.cart) await storageService.setCart(backup.cart);
      if (backup.user) await storageService.setUser(backup.user);
      if (backup.userPreferences) await storageService.setUserPreferences(backup.userPreferences);
      if (backup.selectedRestaurant) await storageService.setSelectedRestaurant(backup.selectedRestaurant);
      
      console.log('✅ Restauração concluída');
    } catch (error) {
      console.error('❌ Erro na restauração:', error);
    }
  }
}

/**
 * Função de conveniência para limpeza rápida
 */
export const cleanupStorage = async (): Promise<void> => {
  console.log('🚀 Iniciando limpeza do storage...');
  
  // Fazer backup antes da limpeza
  const backup = await StorageCleanup.backupImportantData();
  
  // Limpeza completa
  await StorageCleanup.fullCleanup();
  
  // Restaurar dados importantes
  if (backup) {
    await StorageCleanup.restoreFromBackup(backup);
  }
  
  // Verificar tamanho final
  await StorageCleanup.checkStorageSize();
  
  console.log('🎉 Limpeza do storage concluída!');
};

// Função específica para limpar dados corrompidos de reservas
export async function cleanupCorruptedReservations(): Promise<void> {
  try {
    console.log('🔧 Verificando dados de reservas corrompidos...');
    
    const reservationsJson = await storageService.getItem('reservations');
    
    if (!reservationsJson) {
      console.log('✅ Nenhum dado de reserva encontrado');
      return;
    }

    // Verificar se é um array válido
    if (Array.isArray(reservationsJson)) {
      console.log('✅ Dados de reservas estão válidos');
      return;
    }

    // Se não é array, pode estar corrompido
    console.log('⚠️ Dados de reservas podem estar corrompidos, limpando...');
    await storageService.removeItem('reservations');
    console.log('✅ Dados de reservas corrompidos removidos');
    
  } catch (error) {
    console.error('❌ Erro ao limpar dados de reservas corrompidos:', error);
  }
}

// Função para verificar e reparar todos os dados corrompidos
export async function repairAllCorruptedData(): Promise<void> {
  try {
    console.log('🔧 Iniciando reparo de dados corrompidos...');
    
    // Limpar reservas corrompidas
    await cleanupCorruptedReservations();
    
    // Validar e corrigir dados
    await StorageCleanup.validateAndFixData();
    
    console.log('✅ Reparo de dados concluído');
  } catch (error) {
    console.error('❌ Erro durante reparo de dados:', error);
  }
} 