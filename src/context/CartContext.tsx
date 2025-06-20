import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { Alert } from "react-native";
import { Dish } from "../domain/dish";
import { storageService } from "../services/storage";

export type CartItem = Dish & {
  quantity: number;
  observations?: string;
};

interface CartContextData {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  updateItemObservations: (id: string, observations: string) => void;
  clearCart: () => void;
  clearCartDirectly: () => void;
  totalItems: number;
  totalPrice: number;
  hasItems: boolean;
}

const CartContext = createContext({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Carrega o carrinho salvo
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const storedCart = await storageService.getCart();
      if (storedCart) {
        setCartItems(storedCart);
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar seu carrinho. Algumas informações podem estar faltando."
      );
    }
  };

  // Salva o carrinho sempre que mudar
  const saveCart = useCallback(async (items: CartItem[]) => {
    try {
      await storageService.setCart(items);
    } catch (error) {
      console.error("Erro ao salvar carrinho:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar seu carrinho. Algumas alterações podem ser perdidas."
      );
    }
  }, []);

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems, saveCart]);

  const addToCart = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      if (quantity <= 0) return;

      setCartItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);

        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
          );
        }

        return [...prev, { ...item, quantity }];
      });
    },
    []
  );

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateItemQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(id);
        return;
      }

      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    },
    [removeFromCart]
  );

  const updateItemObservations = useCallback(
    (id: string, observations: string) => {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, observations } : item))
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    Alert.alert(
      "Limpar Carrinho",
      "Tem certeza que deseja remover todos os itens do carrinho?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Limpar",
          style: "destructive",
          onPress: () => setCartItems([]),
        },
      ]
    );
  }, []);

  const clearCartDirectly = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const hasItems = cartItems.length > 0;

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    updateItemObservations,
    clearCart,
    clearCartDirectly,
    totalItems,
    totalPrice,
    hasItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
