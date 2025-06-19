import { api } from "../lib/axios";
import { Restaurant } from "../domain/restaurant";

interface GetRestaurantResponse {
  restaurant: Restaurant;
}

export async function getRestaurantById(
  restaurantId: string
): Promise<GetRestaurantResponse> {
  const response = await api.get<GetRestaurantResponse>(
    `/restaurants/${restaurantId}`
  );
  return response.data;
}
