import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useGlobalStyles } from "../../theme/hooks";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../lib/format";

const showAlert = (title: string, message: string, options?: any) => {
  if (Platform.OS === "web") {
    if (options && options.length > 1) {
      const result = window.confirm(`${title}\n\n${message}`);
      if (result) {
        const confirmOption =
          options.find((opt: any) => opt.style === "destructive") || options[1];
        if (confirmOption && confirmOption.onPress) {
          confirmOption.onPress();
        }
      }
    } else {
      window.alert(`${title}\n\n${message}`);
    }
  } else {
    // Para mobile, usa o Alert nativo
    Alert.alert(title, message, options);
  }
};

export function CartScreen() {
  const styles = useGlobalStyles();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCartDirectly,
    totalPrice,
  } = useCart();

  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
  };

  const handleAddToCart = (item: any) => {
    addToCart(item);
  };

  const handleClearCart = () => {
    console.log("🛒 handleClearCart chamado");
    showAlert(
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
          onPress: () => {
            console.log("🛒 Limpando carrinho...");
            clearCartDirectly();
            console.log("🛒 Carrinho limpo!");
          },
        },
      ]
    );
  };

  const handleFinalizeOrder = () => {
    console.log("🛒 handleFinalizeOrder chamado");
    if (cartItems.length === 0) {
      showAlert(
        "Carrinho Vazio",
        "Adicione itens ao carrinho antes de finalizar o pedido."
      );
      return;
    }

    showAlert(
      "Finalizar Pedido",
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
              "Pedido Finalizado!",
              "Seu pedido foi enviado com sucesso! Em breve você receberá uma confirmação.",
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
  };

  if (cartItems.length === 0) {
    return (
      <View style={[styles.screenContainer, localStyles.emptyContainer]}>
        <View style={localStyles.emptyContent}>
          <Text style={[styles.title, localStyles.emptyTitle]}>
            Seu carrinho está vazio
          </Text>
          <Text style={[styles.mutedText, localStyles.emptySubtitle]}>
            Adicione pratos para vê-los aqui.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={localStyles.header}>
        <Text style={[styles.title, localStyles.cartTitle]}>Seu Carrinho</Text>
        <Text style={[styles.mutedText, localStyles.cartSubtitle]}>
          Revise seus itens selecionados antes de finalizar o pedido
        </Text>
      </View>

      <ScrollView
        style={localStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={localStyles.scrollContent}
      >
        <View style={localStyles.cartItemsContainer}>
          {cartItems.map((item) => (
            <View
              key={item.id}
              style={[
                styles.card,
                localStyles.cartItem,
                {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                },
              ]}
            >
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={[
                    styles.text,
                    { fontSize: 16, fontWeight: "600", marginBottom: 4 },
                  ]}
                >
                  <Text style={{ fontWeight: "700" }}>Prato: </Text>
                  {item.name}
                </Text>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={[styles.mutedText, { lineHeight: 20 }]}>
                  <Text style={{ fontWeight: "700" }}>Descrição: </Text>
                  {item.description}
                </Text>
              </View>

              <Text style={[styles.text, { marginBottom: 16 }]}>
                <Text style={{ fontWeight: "700" }}>Preço: </Text>
                {formatCurrency(item.price * item.quantity)}
              </Text>

              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleRemoveFromCart(item.id)}
                    style={[
                      styles.card,
                      {
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 6,
                        minWidth: 44,
                        alignItems: "center",
                        padding: 8,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.text, { fontSize: 16, fontWeight: "600" }]}
                    >
                      -
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.text}>{item.quantity}</Text>

                  <TouchableOpacity
                    onPress={() => handleAddToCart(item)}
                    style={[
                      styles.card,
                      {
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 6,
                        minWidth: 44,
                        alignItems: "center",
                        padding: 8,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.text, { fontSize: 16, fontWeight: "600" }]}
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={localStyles.footer}>
        <View style={localStyles.totalContainer}>
          <Text style={localStyles.totalLabel}>Total do Pedido:</Text>
          <Text style={localStyles.totalPrice}>
            {formatCurrency(totalPrice)}
          </Text>
        </View>

        <View style={localStyles.buttonContainer}>
          <TouchableOpacity
            style={[localStyles.testButton, localStyles.clearButton]}
            onPress={handleClearCart}
          >
            <Text style={localStyles.testButtonText}>Limpar Carrinho</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[localStyles.testButton, localStyles.finalizeButton]}
            onPress={handleFinalizeOrder}
          >
            <Text style={[localStyles.testButtonText, { color: "#FFFFFF" }]}>
              Finalizar Pedido
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContent: {
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  cartTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
  },
  cartSubtitle: {
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cartItemsContainer: {
    gap: 16,
  },
  cartItem: {
    marginBottom: 16,
  },
  footer: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "transparent",
  },
  totalContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#16A34A",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  testButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    textAlign: "center",
  },
  clearButton: {
    backgroundColor: "transparent",
  },
  finalizeButton: {
    backgroundColor: "#16A34A",
    borderColor: "#16A34A",
  },
});
