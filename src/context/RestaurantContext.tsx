import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Alert } from "react-native";
import { Restaurant } from "../domain/restaurant";
import { getRestaurantById } from "../services/restaurant";
import { AxiosError } from "axios";

interface RestaurantContextProps {
  restaurant?: Restaurant;
  restaurantId?: string;
  isLoading: boolean;
  refetchRestaurant: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextProps>({
  restaurant: undefined,
  isLoading: true,
  refetchRestaurant: async () => {},
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
  const [isLoading, setIsLoading] = useState(true);

  const fetchRestaurant = async () => {
    if (!restaurantId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const { restaurant: fetchedRestaurant } = await getRestaurantById(
        restaurantId
      );
      setRestaurant(fetchedRestaurant);
    } catch (error) {
      const axiosError = error as AxiosError;

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  const contextValue: RestaurantContextProps = {
    restaurant,
    restaurantId,
    isLoading,
    refetchRestaurant: fetchRestaurant,
  };

  return (
    <RestaurantContext.Provider value={contextValue}>
      {children}
    </RestaurantContext.Provider>
  );
}
