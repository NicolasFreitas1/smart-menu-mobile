export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  restaurantId: string;
  categories?: Array<string>;
}
