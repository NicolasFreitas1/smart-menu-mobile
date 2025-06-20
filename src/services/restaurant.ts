import { api } from "../lib/axios";
import { Dish } from "../domain/dish";
import { Restaurant } from "../domain/restaurant";
import { Category } from "../domain/category";

// Dados mock para quando a API não estiver disponível
const mockRestaurant: Restaurant = {
  id: "restaurant-1",
  name: "Restaurante Exemplo",
  addressId: "address-1",
  createdAt: new Date(),
};

const mockCategories: Category[] = [
  { id: "1", name: "Pizza", createdAt: new Date() },
  { id: "2", name: "Hambúrguer", createdAt: new Date() },
  { id: "3", name: "Sobremesa", createdAt: new Date() },
  { id: "4", name: "Bebida", createdAt: new Date() },
];

const mockDishes: Dish[] = [
  {
    id: "1",
    name: "Pizza Margherita",
    description: "Molho de tomate, mussarela, manjericão fresco",
    price: 25.9,
    restaurantId: "restaurant-1",
    categories: ["Pizza"],
  },
  {
    id: "2",
    name: "Pizza Pepperoni",
    description: "Molho de tomate, mussarela, pepperoni",
    price: 28.9,
    restaurantId: "restaurant-1",
    categories: ["Pizza"],
  },
  {
    id: "3",
    name: "Hambúrguer Clássico",
    description: "Pão, carne, alface, tomate, cebola, queijo",
    price: 18.9,
    restaurantId: "restaurant-1",
    categories: ["Hambúrguer"],
  },
  {
    id: "4",
    name: "Hambúrguer Bacon",
    description: "Pão, carne, bacon, queijo, alface, tomate",
    price: 22.9,
    restaurantId: "restaurant-1",
    categories: ["Hambúrguer"],
  },
  {
    id: "5",
    name: "Tiramisu",
    description: "Sobremesa italiana tradicional",
    price: 12.9,
    restaurantId: "restaurant-1",
    categories: ["Sobremesa"],
  },
  {
    id: "6",
    name: "Brownie",
    description: "Brownie de chocolate com nozes",
    price: 10.9,
    restaurantId: "restaurant-1",
    categories: ["Sobremesa"],
  },
  {
    id: "7",
    name: "Refrigerante",
    description: "Refrigerante 350ml",
    price: 6.9,
    restaurantId: "restaurant-1",
    categories: ["Bebida"],
  },
  {
    id: "8",
    name: "Suco Natural",
    description: "Suco natural de laranja 300ml",
    price: 8.9,
    restaurantId: "restaurant-1",
    categories: ["Bebida"],
  },
];

// Função para verificar se a API está disponível
const isApiAvailable = async (): Promise<boolean> => {
  try {
    await api.get("/health", { timeout: 3000 });
    return true;
  } catch (error) {
    console.log("🌐 API não disponível, usando dados mock");
    return false;
  }
};

// Função para simular delay de rede
const simulateNetworkDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const restaurantService = {
  // Buscar informações do restaurante
  async getRestaurant(restaurantId: string): Promise<Restaurant> {
    try {
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        const response = await api.get(`/restaurants/${restaurantId}`);

        // A API retorna { restaurant: {...} }, então extraímos o restaurante
        const restaurant = response.data.restaurant || response.data;

        console.log("🏪 Restaurant response:", restaurant);
        return restaurant;
      } else {
        // Usar dados mock
        await simulateNetworkDelay();
        return mockRestaurant;
      }
    } catch (error) {
      console.error("Erro ao buscar restaurante:", error);
      // Fallback para dados mock
      await simulateNetworkDelay();
      return mockRestaurant;
    }
  },

  // Buscar categorias
  async getCategories(): Promise<Category[]> {
    try {
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        const response = await api.get("/categories");

        // A API pode retornar { categories: [...] } ou diretamente [...]
        const categories = response.data.categories || response.data;

        console.log("📂 Categories response:", categories);
        return categories;
      } else {
        // Usar dados mock
        await simulateNetworkDelay();
        return mockCategories;
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      // Fallback para dados mock
      await simulateNetworkDelay();
      return mockCategories;
    }
  },

  // Buscar pratos
  async getDishes(
    restaurantId: string,
    filters?: {
      selectedCategories?: string[];
      priceRange?: { min: number; max: number };
      dietaryRestrictions?: string[];
      sortBy?: string;
      showFavoritesOnly?: boolean;
    }
  ): Promise<Dish[]> {
    try {
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        const params = new URLSearchParams();
        params.append("page", "1");
        params.append("per_page", "9999");

        if (filters?.selectedCategories?.length) {
          params.append("categoryFilter", filters.selectedCategories.join(","));
        }
        if (filters?.priceRange) {
          params.append("min_price", filters.priceRange.min.toString());
          params.append("max_price", filters.priceRange.max.toString());
        }
        if (filters?.sortBy) {
          params.append("sort_by", filters.sortBy);
        }

        const response = await api.get(
          `/dishes/restaurant/${restaurantId}?${params}`
        );

        // A API pode retornar { dishes: [...] } ou diretamente [...]
        const dishes =
          response.data.dishes || response.data.data || response.data;

        console.log("🍽️ Dishes response:", dishes);
        return dishes;
      } else {
        // Usar dados mock com filtros
        await simulateNetworkDelay();
        let filteredDishes = [...mockDishes];
        console.log("🍽️ Initial mock dishes count:", filteredDishes.length);

        // Aplicar filtros
        if (filters?.selectedCategories?.length) {
          console.log(
            "🔍 Filtering by categories:",
            filters.selectedCategories
          );
          filteredDishes = filteredDishes.filter((dish) => {
            const matches = dish.categories?.some((cat) =>
              filters.selectedCategories!.includes(cat)
            );
            console.log(
              `🍽️ Dish "${dish.name}" categories:`,
              dish.categories,
              "matches:",
              matches
            );
            return matches;
          });
          console.log(
            "🍽️ Dishes after category filter:",
            filteredDishes.length
          );
        }

        if (filters?.priceRange) {
          console.log("💰 Filtering by price range:", filters.priceRange);
          filteredDishes = filteredDishes.filter(
            (dish) =>
              dish.price >= filters.priceRange!.min &&
              dish.price <= filters.priceRange!.max
          );
          console.log("🍽️ Dishes after price filter:", filteredDishes.length);
        }

        if (filters?.sortBy) {
          console.log("📊 Sorting by:", filters.sortBy);
          switch (filters.sortBy) {
            case "name":
              filteredDishes.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case "price":
              filteredDishes.sort((a, b) => a.price - b.price);
              break;
            default:
              break;
          }
        }

        console.log("🍽️ Final filtered dishes count:", filteredDishes.length);
        return filteredDishes;
      }
    } catch (error) {
      console.error("Erro ao buscar pratos:", error);
      // Fallback para dados mock
      await simulateNetworkDelay();
      return mockDishes;
    }
  },

  // Buscar prato por ID
  async getDish(dishId: string): Promise<Dish | null> {
    try {
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        const response = await api.get(`/dishes/${dishId}`);
        return response.data;
      } else {
        // Usar dados mock
        await simulateNetworkDelay();
        return mockDishes.find((dish) => dish.id === dishId) || null;
      }
    } catch (error) {
      console.error("Erro ao buscar prato:", error);
      // Fallback para dados mock
      await simulateNetworkDelay();
      return mockDishes.find((dish) => dish.id === dishId) || null;
    }
  },

  // Buscar pratos por categoria
  async getDishesByCategory(category: string): Promise<Dish[]> {
    try {
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        const response = await api.get(`/dishes/category/${category}`);
        return response.data;
      } else {
        // Usar dados mock
        await simulateNetworkDelay();
        return mockDishes.filter((dish) => dish.categories?.includes(category));
      }
    } catch (error) {
      console.error("Erro ao buscar pratos por categoria:", error);
      // Fallback para dados mock
      await simulateNetworkDelay();
      return mockDishes.filter((dish) => dish.categories?.includes(category));
    }
  },

  // Buscar pratos populares
  async getPopularDishes(limit: number = 5): Promise<Dish[]> {
    try {
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        const response = await api.get(`/dishes/popular?limit=${limit}`);
        return response.data;
      } else {
        // Usar dados mock
        await simulateNetworkDelay();
        return mockDishes.slice(0, limit);
      }
    } catch (error) {
      console.error("Erro ao buscar pratos populares:", error);
      // Fallback para dados mock
      await simulateNetworkDelay();
      return mockDishes.slice(0, limit);
    }
  },
};
