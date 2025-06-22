import { OfflineSyncData } from '../types/assistant';
import { storageService } from './storage';
import { restaurantService } from './restaurant';
import { api } from '../lib/axios';

class OfflineSyncService {
  private isOnline = true;
  private syncInProgress = false;
  private lastSyncTime: string | null = null;

  // Verificar conectividade
  async checkConnectivity(): Promise<boolean> {
    try {
      await api.get('/health', { timeout: 5000 });
      this.isOnline = true;
      return true;
    } catch (error) {
      this.isOnline = false;
      return false;
    }
  }

  // Inicializar sincronização
  async initialize(): Promise<void> {
    try {
      // Carregar dados de sincronização
      const syncData = await this.getSyncData();
      this.lastSyncTime = syncData.lastSync;

      // Verificar conectividade
      const isOnline = await this.checkConnectivity();

      if (isOnline) {
        // Sincronizar dados se estiver online
        await this.syncData();
      } else {
        console.log('📱 Modo offline ativo - usando dados em cache');
      }
    } catch (error) {
      console.error('Erro ao inicializar sincronização offline:', error);
    }
  }

  // Sincronizar dados
  async syncData(): Promise<void> {
    if (this.syncInProgress) {
      console.log('🔄 Sincronização já em andamento...');
      return;
    }

    if (!this.isOnline) {
      console.log('📱 Sem conexão - sincronização adiada');
      return;
    }

    this.syncInProgress = true;

    try {
      console.log('🔄 Iniciando sincronização de dados...');

      // Sincronizar restaurantes
      await this.syncRestaurants();

      // Sincronizar pratos
      await this.syncDishes();

      // Sincronizar categorias
      await this.syncCategories();

      // Processar ações pendentes
      await this.processPendingActions();

      // Atualizar timestamp de sincronização
      this.lastSyncTime = new Date().toISOString();
      await this.updateSyncData({
        lastSync: this.lastSyncTime,
        dishes: await this.getCachedDishes(),
        categories: await this.getCachedCategories(),
        restaurants: await this.getCachedRestaurants(),
        pendingActions: [],
      });

      console.log('✅ Sincronização concluída com sucesso');
    } catch (error) {
      console.error('❌ Erro durante sincronização:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Sincronizar restaurantes
  private async syncRestaurants(): Promise<void> {
    try {
      const restaurants = await restaurantService.getAllRestaurants();
      await this.cacheRestaurants(restaurants);
      console.log(`🏪 ${restaurants.length} restaurantes sincronizados`);
    } catch (error) {
      console.error('Erro ao sincronizar restaurantes:', error);
    }
  }

  // Sincronizar pratos
  private async syncDishes(): Promise<void> {
    try {
      // Buscar pratos de todos os restaurantes
      const restaurants = await this.getCachedRestaurants();
      const allDishes = [];

      for (const restaurant of restaurants) {
        try {
          const dishes = await restaurantService.getDishes(restaurant.id);
          allDishes.push(...dishes);
        } catch (error) {
          console.error(`Erro ao buscar pratos do restaurante ${restaurant.id}:`, error);
        }
      }

      await this.cacheDishes(allDishes);
      console.log(`🍽️ ${allDishes.length} pratos sincronizados`);
    } catch (error) {
      console.error('Erro ao sincronizar pratos:', error);
    }
  }

  // Sincronizar categorias
  private async syncCategories(): Promise<void> {
    try {
      const categories = await restaurantService.getCategories();
      await this.cacheCategories(categories);
      console.log(`📂 ${categories.length} categorias sincronizadas`);
    } catch (error) {
      console.error('Erro ao sincronizar categorias:', error);
    }
  }

  // Processar ações pendentes
  private async processPendingActions(): Promise<void> {
    try {
      const syncData = await this.getSyncData();
      const pendingActions = syncData.pendingActions || [];

      if (pendingActions.length === 0) {
        return;
      }

      console.log(`⏳ Processando ${pendingActions.length} ações pendentes...`);

      for (const action of pendingActions) {
        try {
          await this.processAction(action);
        } catch (error) {
          console.error('Erro ao processar ação pendente:', error);
        }
      }

      // Limpar ações processadas
      await this.updateSyncData({
        ...syncData,
        pendingActions: [],
      });

      console.log('✅ Ações pendentes processadas');
    } catch (error) {
      console.error('Erro ao processar ações pendentes:', error);
    }
  }

  // Processar ação individual
  private async processAction(action: any): Promise<void> {
    switch (action.type) {
      case 'create_order':
        // Enviar pedido para o servidor
        await api.post('/orders', action.data);
        break;
      case 'update_order':
        // Atualizar pedido no servidor
        await api.put(`/orders/${action.data.id}`, action.data);
        break;
      case 'create_review':
        // Enviar avaliação para o servidor
        await api.post('/reviews', action.data);
        break;
      default:
        console.warn('Tipo de ação não reconhecido:', action.type);
    }
  }

  // Adicionar ação pendente
  async addPendingAction(type: string, data: any): Promise<void> {
    try {
      const syncData = await this.getSyncData();
      const pendingActions = syncData.pendingActions || [];

      pendingActions.push({
        id: `action-${Date.now()}`,
        type,
        data,
        createdAt: new Date().toISOString(),
      });

      await this.updateSyncData({
        ...syncData,
        pendingActions,
      });

      console.log(`📝 Ação pendente adicionada: ${type}`);
    } catch (error) {
      console.error('Erro ao adicionar ação pendente:', error);
    }
  }

  // Cache de restaurantes
  private async cacheRestaurants(restaurants: any[]): Promise<void> {
    try {
      await storageService.setItem('cached_restaurants', restaurants);
    } catch (error) {
      console.error('Erro ao cachear restaurantes:', error);
    }
  }

  private async getCachedRestaurants(): Promise<any[]> {
    try {
      const cached = await storageService.getItem('cached_restaurants');
      if (!cached) return [];
      
      // Verificar se já é um array (não precisa de parse)
      if (Array.isArray(cached)) {
        return cached;
      }
      
      // Tentar fazer parse se for string
      if (typeof cached === 'string') {
        return JSON.parse(cached);
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao carregar restaurantes do cache:', error);
      return [];
    }
  }

  // Cache de pratos
  private async cacheDishes(dishes: any[]): Promise<void> {
    try {
      await storageService.setItem('cached_dishes', dishes);
    } catch (error) {
      console.error('Erro ao cachear pratos:', error);
    }
  }

  private async getCachedDishes(): Promise<any[]> {
    try {
      const cached = await storageService.getItem('cached_dishes');
      if (!cached) return [];
      
      // Verificar se já é um array (não precisa de parse)
      if (Array.isArray(cached)) {
        return cached;
      }
      
      // Tentar fazer parse se for string
      if (typeof cached === 'string') {
        return JSON.parse(cached);
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao carregar pratos do cache:', error);
      return [];
    }
  }

  // Cache de categorias
  private async cacheCategories(categories: any[]): Promise<void> {
    try {
      await storageService.setItem('cached_categories', categories);
    } catch (error) {
      console.error('Erro ao cachear categorias:', error);
    }
  }

  private async getCachedCategories(): Promise<any[]> {
    try {
      const cached = await storageService.getItem('cached_categories');
      if (!cached) return [];
      
      // Verificar se já é um array (não precisa de parse)
      if (Array.isArray(cached)) {
        return cached;
      }
      
      // Tentar fazer parse se for string
      if (typeof cached === 'string') {
        return JSON.parse(cached);
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao carregar categorias do cache:', error);
      return [];
    }
  }

  // Obter dados de sincronização
  private async getSyncData(): Promise<OfflineSyncData> {
    try {
      const syncDataJson = await storageService.getItem('offline_sync_data');
      
      if (!syncDataJson) {
        return this.getDefaultSyncData();
      }
      
      // Verificar se já é um objeto (não precisa de parse)
      if (typeof syncDataJson === 'object' && syncDataJson !== null) {
        return this.validateSyncData(syncDataJson);
      }
      
      // Tentar fazer parse se for string
      if (typeof syncDataJson === 'string') {
        const parsed = JSON.parse(syncDataJson);
        return this.validateSyncData(parsed);
      }
      
      return this.getDefaultSyncData();
    } catch (error) {
      console.error('Erro ao carregar dados de sincronização:', error);
      return this.getDefaultSyncData();
    }
  }

  // Validar dados de sincronização
  private validateSyncData(data: any): OfflineSyncData {
    const defaultData = this.getDefaultSyncData();
    
    return {
      lastSync: data.lastSync || defaultData.lastSync,
      dishes: Array.isArray(data.dishes) ? data.dishes : defaultData.dishes,
      categories: Array.isArray(data.categories) ? data.categories : defaultData.categories,
      restaurants: Array.isArray(data.restaurants) ? data.restaurants : defaultData.restaurants,
      pendingActions: Array.isArray(data.pendingActions) ? data.pendingActions : defaultData.pendingActions,
    };
  }

  // Obter dados padrão de sincronização
  private getDefaultSyncData(): OfflineSyncData {
    return {
      lastSync: new Date().toISOString(),
      dishes: [],
      categories: [],
      restaurants: [],
      pendingActions: [],
    };
  }

  // Atualizar dados de sincronização
  private async updateSyncData(syncData: OfflineSyncData): Promise<void> {
    try {
      await storageService.setItem('offline_sync_data', syncData);
    } catch (error) {
      console.error('Erro ao atualizar dados de sincronização:', error);
    }
  }

  // Verificar se dados estão atualizados
  async isDataStale(maxAgeMinutes: number = 60): Promise<boolean> {
    if (!this.lastSyncTime) {
      return true; // Nunca sincronizado
    }

    const lastSync = new Date(this.lastSyncTime);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastSync.getTime()) / (1000 * 60);

    return diffMinutes > maxAgeMinutes;
  }

  // Forçar sincronização
  async forceSync(): Promise<void> {
    console.log('🔄 Forçando sincronização...');
    await this.syncData();
  }

  // Limpar cache
  async clearCache(): Promise<void> {
    try {
      await storageService.removeItem('cached_restaurants');
      await storageService.removeItem('cached_dishes');
      await storageService.removeItem('cached_categories');
      await storageService.removeItem('offline_sync_data');
      
      console.log('🗑️ Cache limpo');
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }

  // Obter status da sincronização
  getSyncStatus(): {
    isOnline: boolean;
    isSyncing: boolean;
    lastSync: string | null;
    hasPendingActions: boolean;
  } {
    return {
      isOnline: this.isOnline,
      isSyncing: this.syncInProgress,
      lastSync: this.lastSyncTime,
      hasPendingActions: false, // Implementar verificação de ações pendentes
    };
  }

  // Verificar se está online
  isOnlineMode(): boolean {
    return this.isOnline;
  }

  // Verificar se está sincronizando
  isSyncing(): boolean {
    return this.syncInProgress;
  }
}

export const offlineSyncService = new OfflineSyncService(); 