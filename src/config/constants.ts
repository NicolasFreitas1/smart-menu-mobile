// Constantes de navegação
export const ROUTES = {
  HOME: 'Home',
  MENU: 'Menu',
  CART: 'Cart',
  ASSISTANT: 'Assistant',
  SETTINGS: 'Settings',
  SURPRISE_ME: 'Surprise',
  ORDER_HISTORY: 'OrderHistory',
} as const;

// Constantes de categorias
export const CATEGORIES = {
  ALL: 'Todas',
} as const;

// Constantes de filtros
export const FILTERS = {
  DEFAULT_CATEGORY: 'Todas',
  DEFAULT_PRICE_RANGE: [0, 1000],
  DEFAULT_SORT_BY: 'name',
} as const;

// Constantes de mensagens
export const MESSAGES = {
  LOADING: 'Carregando...',
  ERROR: {
    FETCH_CATEGORIES: 'Erro ao carregar categorias',
    FETCH_DISHES: 'Erro ao carregar pratos',
    RESTAURANT_NOT_FOUND: 'Restaurante não encontrado',
    INITIAL_LOAD: 'Erro ao carregar dados iniciais',
  },
  SUCCESS: {
    ORDER_FINALIZED: 'Pedido Finalizado!',
    ORDER_CONFIRMATION: 'Seu pedido foi enviado com sucesso! Em breve você receberá uma confirmação.',
  },
  CONFIRMATION: {
    CLEAR_CART: {
      TITLE: 'Limpar Carrinho',
      MESSAGE: 'Tem certeza que deseja remover todos os itens do carrinho?',
    },
    FINALIZE_ORDER: {
      TITLE: 'Finalizar Pedido',
      EMPTY_CART: 'Adicione itens ao carrinho antes de finalizar o pedido.',
    },
  },
} as const;

// Constantes de cores
export const COLORS = {
  PRIMARY: '#48BB78',
  SECONDARY: '#E4572E',
  SUCCESS: '#16A34A',
  WARNING: '#F59E0B',
  ERROR: '#DC2626',
  INFO: '#3B82F6',
} as const;

// Constantes de estilos
export const STYLES = {
  SHADOW: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  BORDER_RADIUS: {
    SMALL: 6,
    MEDIUM: 8,
    LARGE: 12,
  },
  PADDING: {
    SMALL: 8,
    MEDIUM: 12,
    LARGE: 16,
    XL: 24,
  },
  MARGIN: {
    SMALL: 8,
    MEDIUM: 12,
    LARGE: 16,
    XL: 24,
  },
} as const;

// Constantes de animação
export const ANIMATION = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
} as const; 