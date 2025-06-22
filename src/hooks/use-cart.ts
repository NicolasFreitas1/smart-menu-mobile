import { useCallback } from "react";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../lib/format";
import { showAlert } from "../utils/helpers";
import { MESSAGES } from "../config/constants";

export function useCartScreen() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCartDirectly,
    totalPrice,
  } = useCart();

  const handleRemoveFromCart = useCallback((id: string) => {
    removeFromCart(id);
  }, [removeFromCart]);

  const handleAddToCart = useCallback((item: any) => {
    addToCart(item);
  }, [addToCart]);

  const handleIncreaseQuantity = useCallback((item: any) => {
    const currentItem = cartItems.find(i => i.id === item.id);
    if (currentItem) {
      updateItemQuantity(item.id, currentItem.quantity + 1);
    } else {
      addToCart(item, 1);
    }
  }, [cartItems, updateItemQuantity, addToCart]);

  const handleDecreaseQuantity = useCallback((item: any) => {
    const currentItem = cartItems.find(i => i.id === item.id);
    if (currentItem && currentItem.quantity > 1) {
      updateItemQuantity(item.id, currentItem.quantity - 1);
    } else if (currentItem && currentItem.quantity === 1) {
      removeFromCart(item.id);
    }
  }, [cartItems, updateItemQuantity, removeFromCart]);

  const handleClearCart = useCallback(() => {
    console.log("🛒 handleClearCart chamado");
    showAlert(
      MESSAGES.CONFIRMATION.CLEAR_CART.TITLE,
      MESSAGES.CONFIRMATION.CLEAR_CART.MESSAGE,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Limpar",
          style: "destructive",
          onPress: () => {
            console.log("🛒 Limpando carrinho...");
            clearCartDirectly();
            console.log("🛒 Carrinho limpo!");
          },
        },
      ]
    );
  }, [clearCartDirectly]);

  const handleFinalizeOrder = useCallback(() => {
    console.log("🛒 handleFinalizeOrder chamado");
    if (cartItems.length === 0) {
      showAlert(
        MESSAGES.CONFIRMATION.FINALIZE_ORDER.TITLE,
        MESSAGES.CONFIRMATION.FINALIZE_ORDER.EMPTY_CART
      );
      return;
    }

    showAlert(
      MESSAGES.CONFIRMATION.FINALIZE_ORDER.TITLE,
      `Deseja finalizar seu pedido?\n\nTotal: ${formatCurrency(totalPrice)}`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Finalizar",
          onPress: () => {
            console.log("🛒 Finalizando pedido...");
            showAlert(
              MESSAGES.SUCCESS.ORDER_FINALIZED,
              MESSAGES.SUCCESS.ORDER_CONFIRMATION,
              [
                {
                  text: "OK",
                  onPress: () => {
                    console.log("🛒 Limpando carrinho após finalizar...");
                    clearCartDirectly();
                    console.log("🛒 Carrinho limpo após finalizar!");
                  },
                },
              ]
            );
          },
        },
      ]
    );
  }, [cartItems.length, totalPrice, clearCartDirectly]);

  return {
    // State
    cartItems,
    totalPrice,
    
    // Actions
    handleRemoveFromCart,
    handleAddToCart,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleClearCart,
    handleFinalizeOrder,
  };
} 