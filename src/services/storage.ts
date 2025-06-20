import AsyncStorage from "@react-native-async-storage/async-storage";

// Chaves de armazenamento
export const STORAGE_KEYS = {
  THEME: "@smart-menu:theme",
  CART: "@smart-menu:cart",
  AUTH_TOKEN: "@smart-menu:auth:token",
  USER: "@smart-menu:auth:user",
  RESTAURANT_HISTORY: "@smart-menu:restaurant:history",
  USER_PREFERENCES: "@smart-menu:user:preferences",
  LAST_VISITED_RESTAURANT: "@smart-menu:restaurant:last-visited",
} as const;

// Tipos para os dados armazenados
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
      return item ? JSON.parse(item) : null;
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

      await AsyncStorage.setItem(key, JSON.stringify(value));
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

      let used = 0;
      info.forEach(([key, value]) => {
        if (value) {
          used += key.length + value.length;
        }
      });

      return { used, total: 50 * 1024 * 1024 }; // Assumindo 50MB como limite
    } catch (error) {
      console.error("Erro ao obter informações do storage:", error);
      return null;
    }
  }
}

// Instância singleton
export const storageService = new StorageService();

// Hooks úteis para usar com React
export const useStorage = () => {
  return {
    getItem: storageService.getItem.bind(storageService),
    setItem: storageService.setItem.bind(storageService),
    removeItem: storageService.removeItem.bind(storageService),
    clear: storageService.clear.bind(storageService),
  };
};
