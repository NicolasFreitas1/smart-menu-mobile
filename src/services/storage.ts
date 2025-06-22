import AsyncStorage from "@react-native-async-storage/async-storage";

// Chaves para o storage
const STORAGE_KEYS = {
  THEME: "theme",
  CART: "cart",
  AUTH_TOKEN: "auth_token",
  USER: "user",
  USER_PREFERENCES: "user_preferences",
  RESTAURANT_HISTORY: "restaurant_history",
  LAST_VISITED_RESTAURANT: "last_visited_restaurant",
  SELECTED_RESTAURANT: "selected_restaurant",
  RESERVATIONS: "reservations",
} as const;

// Interface para preferências do usuário
export interface UserPreferences {
  favoriteCategories?: string[];
  dietaryRestrictions?: string[];
  language?: string;
  notifications?: {
    orderUpdates: boolean;
    promotions: boolean;
    newItems: boolean;
  };
}

// Interface para histórico de restaurantes
export interface RestaurantHistory {
  id: string;
  name: string;
  lastVisited: string;
  visitCount: number;
}

// Classe principal para gerenciar o storage
class StorageService {
  // Métodos genéricos
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(key);
      if (!item) return null;
      
      // Tentar fazer parse de JSON
      try {
        return JSON.parse(item);
      } catch (parseError) {
        // Se falhar o parse, retornar o item como string
        console.warn(`Item ${key} não é JSON válido, retornando como string:`, parseError);
        return item as T;
      }
    } catch (error) {
      console.error(`Erro ao ler item ${key}:`, error);
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      // Validação para evitar salvar valores undefined/null
      if (value === undefined || value === null) {
        console.warn(
          `⚠️ Tentativa de salvar valor inválido para ${key}:`,
          value
        );
        return;
      }

      // Se o valor já for string, salvar diretamente
      if (typeof value === 'string') {
        await AsyncStorage.setItem(key, value);
      } else {
        // Para outros tipos, fazer stringify
        await AsyncStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Erro ao salvar item ${key}:`, error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Erro ao remover item ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Erro ao limpar storage:", error);
      throw error;
    }
  }

  // Métodos específicos para tema
  async getTheme(): Promise<string | null> {
    return this.getItem<string>(STORAGE_KEYS.THEME);
  }

  async setTheme(theme: string): Promise<void> {
    return this.setItem(STORAGE_KEYS.THEME, theme);
  }

  // Métodos específicos para carrinho
  async getCart(): Promise<any[] | null> {
    return this.getItem<any[]>(STORAGE_KEYS.CART);
  }

  async setCart(cart: any[]): Promise<void> {
    return this.setItem(STORAGE_KEYS.CART, cart);
  }

  // Métodos específicos para autenticação
  async getAuthToken(): Promise<string | null> {
    return this.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
  }

  async setAuthToken(token: string): Promise<void> {
    return this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  async getUser(): Promise<any | null> {
    return this.getItem<any>(STORAGE_KEYS.USER);
  }

  async setUser(user: any): Promise<void> {
    return this.setItem(STORAGE_KEYS.USER, user);
  }

  async clearAuth(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await this.removeItem(STORAGE_KEYS.USER);
  }

  // Métodos específicos para preferências do usuário
  async getUserPreferences(): Promise<UserPreferences | null> {
    return this.getItem<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES);
  }

  async setUserPreferences(preferences: UserPreferences): Promise<void> {
    return this.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  async updateUserPreferences(
    updates: Partial<UserPreferences>
  ): Promise<void> {
    const current = await this.getUserPreferences();
    const updated = { ...current, ...updates };
    return this.setUserPreferences(updated);
  }

  // Métodos específicos para histórico de restaurantes
  async getRestaurantHistory(): Promise<RestaurantHistory[] | null> {
    return this.getItem<RestaurantHistory[]>(STORAGE_KEYS.RESTAURANT_HISTORY);
  }

  async addRestaurantToHistory(restaurant: {
    id: string;
    name: string;
  }): Promise<void> {
    const history = (await this.getRestaurantHistory()) || [];
    const now = new Date().toISOString();

    const existingIndex = history.findIndex(
      (item) => item.id === restaurant.id
    );

    if (existingIndex >= 0) {
      // Atualiza restaurante existente
      history[existingIndex] = {
        ...history[existingIndex],
        lastVisited: now,
        visitCount: history[existingIndex].visitCount + 1,
      };
    } else {
      // Adiciona novo restaurante
      history.unshift({
        id: restaurant.id,
        name: restaurant.name,
        lastVisited: now,
        visitCount: 1,
      });
    }

    // Mantém apenas os últimos 10 restaurantes
    const limitedHistory = history.slice(0, 10);

    return this.setItem(STORAGE_KEYS.RESTAURANT_HISTORY, limitedHistory);
  }

  // Métodos específicos para último restaurante visitado
  async getLastVisitedRestaurant(): Promise<string | null> {
    return this.getItem<string>(STORAGE_KEYS.LAST_VISITED_RESTAURANT);
  }

  async setLastVisitedRestaurant(restaurantId: string): Promise<void> {
    // Validação adicional para o ID do restaurante
    if (!restaurantId || restaurantId.trim() === "") {
      console.warn(
        "⚠️ Tentativa de salvar ID de restaurante inválido:",
        restaurantId
      );
      return;
    }

    return this.setItem(STORAGE_KEYS.LAST_VISITED_RESTAURANT, restaurantId);
  }

  // Métodos específicos para restaurante selecionado
  async getSelectedRestaurant(): Promise<any | null> {
    return this.getItem<any>(STORAGE_KEYS.SELECTED_RESTAURANT);
  }

  async setSelectedRestaurant(restaurant: any): Promise<void> {
    // Validação para garantir que o restaurante tem os campos necessários
    if (!restaurant || !restaurant.id || !restaurant.name) {
      console.warn(
        "⚠️ Tentativa de salvar restaurante inválido:",
        restaurant
      );
      return;
    }

    return this.setItem(STORAGE_KEYS.SELECTED_RESTAURANT, restaurant);
  }

  async clearSelectedRestaurant(): Promise<void> {
    return this.removeItem(STORAGE_KEYS.SELECTED_RESTAURANT);
  }

  // Métodos específicos para reservas
  async getReservations(): Promise<any[] | null> {
    try {
      console.log('🔍 Storage: Buscando reservas...');
      const reservations = await this.getItem<any[]>(STORAGE_KEYS.RESERVATIONS);
      console.log('📋 Storage: Reservas encontradas:', reservations?.length || 0);
      console.log('📋 Storage: Detalhes:', reservations);
      return reservations;
    } catch (error) {
      console.error('❌ Storage: Erro ao buscar reservas:', error);
      return null;
    }
  }

  async setReservations(reservations: any[]): Promise<void> {
    try {
      console.log('💾 Storage: Salvando reservas:', reservations.length);
      console.log('💾 Storage: Detalhes:', reservations);
      await this.setItem(STORAGE_KEYS.RESERVATIONS, reservations);
      console.log('✅ Storage: Reservas salvas com sucesso');
    } catch (error) {
      console.error('❌ Storage: Erro ao salvar reservas:', error);
      throw error;
    }
  }

  async addReservation(reservation: any): Promise<void> {
    try {
      console.log('➕ Storage: Adicionando reserva:', reservation);
      const reservations = (await this.getReservations()) || [];
      reservations.push(reservation);
      console.log('📋 Storage: Total de reservas após adição:', reservations.length);
      await this.setReservations(reservations);
      console.log('✅ Storage: Reserva adicionada com sucesso');
    } catch (error) {
      console.error('❌ Storage: Erro ao adicionar reserva:', error);
      throw error;
    }
  }

  async updateReservation(reservationId: string, updates: any): Promise<void> {
    const reservations = (await this.getReservations()) || [];
    const index = reservations.findIndex(r => r.id === reservationId);
    if (index >= 0) {
      reservations[index] = { ...reservations[index], ...updates };
      return this.setReservations(reservations);
    }
  }

  async removeReservation(reservationId: string): Promise<void> {
    const reservations = (await this.getReservations()) || [];
    const filtered = reservations.filter(r => r.id !== reservationId);
    return this.setReservations(filtered);
  }

  // Método para migração de dados (se necessário no futuro)
  async migrateData(): Promise<void> {
    // Aqui você pode adicionar lógica de migração quando necessário
    console.log("Verificando necessidade de migração de dados...");
  }

  // Método para obter informações sobre o uso do storage
  async getStorageInfo(): Promise<{ used: number; total: number } | null> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const info = await AsyncStorage.multiGet(keys);
      
      let totalSize = 0;
      info.forEach(([key, value]) => {
        if (value) {
          totalSize += key.length + value.length;
        }
      });

      return {
        used: totalSize,
        total: 6 * 1024 * 1024, // 6MB é o limite típico do AsyncStorage
      };
    } catch (error) {
      console.error("Erro ao obter informações do storage:", error);
      return null;
    }
  }

  // Método para limpar dados antigos
  async cleanupOldData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const now = Date.now();
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000; // 1 semana

      for (const key of keys) {
        // Aqui você pode implementar lógica para limpar dados antigos
        // Por exemplo, verificar timestamps nos dados
        console.log(`Verificando chave: ${key}`);
      }
    } catch (error) {
      console.error("Erro ao limpar dados antigos:", error);
    }
  }
}

// Instância singleton do serviço
export const storageService = new StorageService();

// Hook para usar o storage (opcional)
export const useStorage = () => {
  return storageService;
};
