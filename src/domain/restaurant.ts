export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  openingHours: {
    weekday: string;
    open: string;
    close: string;
  }[];
  categories: {
    id: string;
    name: string;
    description?: string;
  }[];
}
