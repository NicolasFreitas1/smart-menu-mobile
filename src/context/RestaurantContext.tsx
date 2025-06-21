import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Alert } from "react-native";
import { Restaurant } from "../domain/restaurant";
import { restaurantService } from "../services/restaurant";
import { storageService } from "../services/storage";
import { AxiosError } from "axios";

interface RestaurantContextProps {
  restaurant?: Restaurant;
  restaurantId?: string;
  isLoading: boolean;
  refetchRestaurant: () => Promise<void>;
  restaurantHistory: any[];
  addToHistory: (restaurant: { id: string; name: string }) => Promise<void>;
  lastVisitedRestaurant?: string;
  selectedRestaurant?: Restaurant | null;
  saveSelectedRestaurant: (restaurant: Restaurant) => Promise<boolean>;
  clearSelectedRestaurant: () => Promise<boolean>;
}

const RestaurantContext = createContext<RestaurantContextProps>({
  restaurant: undefined,
  isLoading: true,
  refetchRestaurant: async () => {},
  restaurantHistory: [],
  addToHistory: async () => {},
  saveSelectedRestaurant: async () => false,
  clearSelectedRestaurant: async () => false,
});

export function useRestaurant() {
  return useContext(RestaurantContext);
}

interface RestaurantProviderProps {
  children: ReactNode;
  restaurantId?: string;
}

export function RestaurantProvider({
  children,
  restaurantId,
}: RestaurantProviderProps) {
  const [restaurant, setRestaurant] = useState<Restaurant | undefined>();
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantHistory, setRestaurantHistory] = useState<any[]>([]);
  const [lastVisitedRestaurant, setLastVisitedRestaurant] = useState<
    string | undefined
  >();

  // Carrega dados locais ao inicializar
  useEffect(() => {
    loadLocalData();
  }, []);

  const loadLocalData = async () => {
    try {
      const history = await storageService.getRestaurantHistory();
      const lastVisited = await storageService.getLastVisitedRestaurant();
      const savedRestaurant = await storageService.getSelectedRestaurant();

      if (history) {
        setRestaurantHistory(history);
      }

      if (lastVisited) {
        setLastVisitedRestaurant(lastVisited);
      }

      if (savedRestaurant) {
        setSelectedRestaurant(savedRestaurant);
        // Usa o restaurante salvo como restaurante principal
        setRestaurant(savedRestaurant);
      }
    } catch (error) {
      console.error("Erro ao carregar dados locais:", error);
    }
  };

  const fetchRestaurant = async () => {
    // Se não há restaurante salvo, usa o ID configurado
    const targetRestaurantId = selectedRestaurant?.id || restaurantId;

    if (!targetRestaurantId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const fetchedRestaurant = await restaurantService.getRestaurant(
        targetRestaurantId
      );

      if (fetchedRestaurant && fetchedRestaurant.id) {
        setRestaurant(fetchedRestaurant);

        // Salva o restaurante no histórico e como último visitado
        await addToHistory({
          id: fetchedRestaurant.id,
          name: fetchedRestaurant.name,
        });

        // Só salva se o ID for válido
        if (fetchedRestaurant.id) {
          await storageService.setLastVisitedRestaurant(fetchedRestaurant.id);
          setLastVisitedRestaurant(fetchedRestaurant.id);
        }
      } else {
        console.warn(
          "⚠️ Restaurante retornado sem ID válido:",
          fetchedRestaurant
        );
        setRestaurant(undefined);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("❌ Erro ao buscar restaurante:", error);

      if (axiosError.response?.status === 404) {
        Alert.alert("Erro", "Restaurante não encontrado", [{ text: "OK" }]);
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível carregar o restaurante. Tente novamente mais tarde.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Tentar Novamente", onPress: () => fetchRestaurant() },
          ]
        );
      }

      // Em caso de erro, não salva nada no histórico
      setRestaurant(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, [selectedRestaurant, restaurantId]);

  const addToHistory = async (restaurant: { id: string; name: string }) => {
    try {
      await storageService.addRestaurantToHistory(restaurant);
      // Recarrega o histórico atualizado
      const updatedHistory = await storageService.getRestaurantHistory();
      if (updatedHistory) {
        setRestaurantHistory(updatedHistory);
      }
    } catch (error) {
      console.error("Erro ao adicionar restaurante ao histórico:", error);
    }
  };

  const saveSelectedRestaurant = async (restaurant: Restaurant) => {
    try {
      await storageService.setSelectedRestaurant(restaurant);
      setSelectedRestaurant(restaurant);
      setRestaurant(restaurant);
      console.log("🏪 Restaurante salvo no contexto:", restaurant.name);
      return true;
    } catch (error) {
      console.error("Erro ao salvar restaurante no contexto:", error);
      return false;
    }
  };

  const clearSelectedRestaurant = async () => {
    try {
      await storageService.clearSelectedRestaurant();
      setSelectedRestaurant(null);
      setRestaurant(undefined);
      console.log("🏪 Restaurante removido do contexto");
      return true;
    } catch (error) {
      console.error("Erro ao remover restaurante do contexto:", error);
      return false;
    }
  };

  const contextValue: RestaurantContextProps = {
    restaurant,
    restaurantId: selectedRestaurant?.id || restaurantId,
    isLoading,
    refetchRestaurant: fetchRestaurant,
    restaurantHistory,
    addToHistory,
    lastVisitedRestaurant,
    selectedRestaurant,
    saveSelectedRestaurant,
    clearSelectedRestaurant,
  };

  return (
    <RestaurantContext.Provider value={contextValue}>
      {children}
    </RestaurantContext.Provider>
  );
}
