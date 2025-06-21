// Tipos para navegação
export interface NavigationProps {
  navigation: any;
  route: any;
}

// Tipos para telas
export interface HomeScreenProps extends NavigationProps {}

export interface MenuScreenProps extends NavigationProps {}

export interface CartScreenProps extends NavigationProps {}

export interface AssistantScreenProps extends NavigationProps {}

export interface SettingsScreenProps extends NavigationProps {}

export interface SurpriseMeScreenProps extends NavigationProps {}

export interface OrderHistoryScreenProps extends NavigationProps {}

// Tipos para estados das telas
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface MenuState extends LoadingState {
  dishes: any[];
  categories: any[];
  selectedCategory: string;
  dishesCount: number;
  hasActiveFilters: boolean | undefined;
}

export interface CartState {
  cartItems: any[];
  totalPrice: number;
  totalItems: number;
  hasItems: boolean;
}

// Tipos para ações das telas
export interface HomeActions {
  handleSettingsPress: () => void;
}

export interface MenuActions {
  refreshData: () => void;
  handleCategoryChange: (category: string) => void;
  resetFilters: () => void;
}

export interface CartActions {
  handleRemoveFromCart: (id: string) => void;
  handleAddToCart: (item: any) => void;
  handleClearCart: () => void;
  handleFinalizeOrder: () => void;
} 