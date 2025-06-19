export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
  ingredients?: string[];
  available: boolean;
  preparationTime?: number; // em minutos
}
