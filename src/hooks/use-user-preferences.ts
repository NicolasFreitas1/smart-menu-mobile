import { useState, useEffect, useCallback } from "react";
import { storageService, UserPreferences } from "../services/storage";

const defaultPreferences: UserPreferences = {
  favoriteCategories: [],
  dietaryRestrictions: [],
  language: "pt-BR",
  notifications: {
    orderUpdates: true,
    promotions: true,
    newItems: true,
  },
};

export function useUserPreferences() {
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega as preferências ao inicializar
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      const savedPreferences = await storageService.getUserPreferences();

      if (savedPreferences) {
        setPreferences({ ...defaultPreferences, ...savedPreferences });
      }
    } catch (error) {
      console.error("Erro ao carregar preferências:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Atualiza preferências específicas
  const updatePreferences = useCallback(
    async (updates: Partial<UserPreferences>) => {
      try {
        const updatedPreferences = { ...preferences, ...updates };
        await storageService.setUserPreferences(updatedPreferences);
        setPreferences(updatedPreferences);
      } catch (error) {
        console.error("Erro ao atualizar preferências:", error);
        throw error;
      }
    },
    [preferences]
  );

  // Adiciona categoria favorita
  const addFavoriteCategory = useCallback(
    async (categoryId: string) => {
      if (!preferences.favoriteCategories?.includes(categoryId)) {
        const updatedCategories = [
          ...(preferences.favoriteCategories || []),
          categoryId,
        ];
        await updatePreferences({ favoriteCategories: updatedCategories });
      }
    },
    [preferences.favoriteCategories, updatePreferences]
  );

  // Remove categoria favorita
  const removeFavoriteCategory = useCallback(
    async (categoryId: string) => {
      const updatedCategories =
        preferences.favoriteCategories?.filter((id) => id !== categoryId) || [];
      await updatePreferences({ favoriteCategories: updatedCategories });
    },
    [preferences.favoriteCategories, updatePreferences]
  );

  // Adiciona restrição dietética
  const addDietaryRestriction = useCallback(
    async (restriction: string) => {
      if (!preferences.dietaryRestrictions?.includes(restriction)) {
        const updatedRestrictions = [
          ...(preferences.dietaryRestrictions || []),
          restriction,
        ];
        await updatePreferences({ dietaryRestrictions: updatedRestrictions });
      }
    },
    [preferences.dietaryRestrictions, updatePreferences]
  );

  // Remove restrição dietética
  const removeDietaryRestriction = useCallback(
    async (restriction: string) => {
      const updatedRestrictions =
        preferences.dietaryRestrictions?.filter((r) => r !== restriction) || [];
      await updatePreferences({ dietaryRestrictions: updatedRestrictions });
    },
    [preferences.dietaryRestrictions, updatePreferences]
  );

  // Atualiza configurações de notificação
  const updateNotificationSettings = useCallback(
    async (settings: Partial<UserPreferences["notifications"]>) => {
      const currentNotifications = preferences.notifications || {
        orderUpdates: true,
        promotions: true,
        newItems: true,
      };
      
      const updatedNotifications = {
        ...currentNotifications,
        ...settings,
      };
      await updatePreferences({ notifications: updatedNotifications });
    },
    [preferences.notifications, updatePreferences]
  );

  // Altera idioma
  const setLanguage = useCallback(
    async (language: string) => {
      await updatePreferences({ language });
    },
    [updatePreferences]
  );

  // Reseta preferências para padrão
  const resetPreferences = useCallback(async () => {
    await storageService.setUserPreferences(defaultPreferences);
    setPreferences(defaultPreferences);
  }, []);

  return {
    preferences,
    isLoading,
    updatePreferences,
    addFavoriteCategory,
    removeFavoriteCategory,
    addDietaryRestriction,
    removeDietaryRestriction,
    updateNotificationSettings,
    setLanguage,
    resetPreferences,
    loadPreferences,
  };
}
