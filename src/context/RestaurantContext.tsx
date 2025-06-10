import { getRestaurantById } from "@/api/get-restaurant-by-id";
import { Restaurant } from "../domain/restaurant";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { toast } from "sonner"; // ⚠️ substitua se não estiver usando `sonner` no mobile

interface RestaurantContextProps {
  restaurant?: Restaurant;
  restaurantId?: string;
  isLoading: boolean;
}

const RestaurantContext = createContext<RestaurantContextProps>({
  restaurant: undefined,
  isLoading: true,
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

  useEffect(() => {
    async function fetch() {
      if (!restaurantId) return;

      setIsLoading(true);

      try {
        const { restaurant: fetchedRestaurant } = await getRestaurantById({
          restaurantId,
        });

        if (!fetchedRestaurant) {
          toast?.error?.("Restaurante não encontrado");
        } else {
          setRestaurant(fetchedRestaurant);
        }
      } catch (error) {
        toast?.error?.("Erro ao buscar restaurante");
      }

      setIsLoading(false);
    }

    fetch();
  }, [restaurantId]);

  return (
    <RestaurantContext.Provider value={{ restaurant, isLoading, restaurantId }}>
      {children}
    </RestaurantContext.Provider>
  );
}
