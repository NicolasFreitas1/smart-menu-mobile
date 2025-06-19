import { api } from "../lib/axios";
import { Dish } from "../domain/dish";
import { Restaurant } from "../domain/restaurant";
import { Category } from "../domain/category";

interface GetRestaurantByIdResponse {
  restaurant: Restaurant;
}

interface GetRestaurantDishesParams {
  restaurantId: string;
  categoryFilter?: string;
  page?: number;
  per_page?: number;
}

interface GetRestaurantDishesResponse {
  data: Dish[];
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
}

export async function getRestaurantById(id: string) {
  const response = await api.get<GetRestaurantByIdResponse>(
    `/restaurants/${id}`
  );
  return response.data;
}

export async function getRestaurantDishes({
  restaurantId,
  categoryFilter,
  page = 1,
  per_page = 9999,
}: GetRestaurantDishesParams): Promise<GetRestaurantDishesResponse> {
  const response = await api.get<GetRestaurantDishesResponse>(
    `/dishes/restaurant/${restaurantId}`,
    {
      params: {
        categoryFilter: categoryFilter,
        page,
        per_page,
      },
    }
  );
  return response.data;
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>("/categories");
  return response.data;
}
