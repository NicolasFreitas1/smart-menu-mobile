export interface Address {
  id: string;
  cep: string;
  street: string;
  number: string;
  city: string;
  state: string;
  country: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Restaurant {
  id: string;
  name: string;
  addressId?: string;
  address?: Address;
  coordinates?: Coordinates;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
}
