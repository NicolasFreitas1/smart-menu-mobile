import { Dish } from "@/domain/dish";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CartItem = Dish & {
  quantity: number;
};

interface CartContextData {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CART_STORAGE_KEY = "@cart";

const CartContext = createContext({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Carrega o carrinho salvo
  useEffect(() => {
    const loadCart = async () => {
      const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    };
    loadCart();
  }, []);

  // Salva o carrinho sempre que mudar
  useEffect(() => {
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(item: Omit<CartItem, "quantity">) {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeFromCart(id: string) {
    setCartItems((prev) =>
      prev.flatMap((item) =>
        item.id === id
          ? item.quantity > 1
            ? [{ ...item, quantity: item.quantity - 1 }]
            : []
          : [item]
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
