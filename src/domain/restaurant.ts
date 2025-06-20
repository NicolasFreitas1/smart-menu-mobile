export interface Restaurant {
  id: string;
  name: string;
  addressId: string;
  createdAt: Date;
  updatedAt?: Date | null;
}
