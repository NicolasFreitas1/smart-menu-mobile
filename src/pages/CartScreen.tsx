import { View, Text } from "react-native";
import { useGlobalStyles } from "../theme/hooks";

export function CartScreen() {
  const styles = useGlobalStyles();
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Carrinho</Text>
      {/* Lista de itens do carrinho */}
      {/* Botão de finalizar pedido */}
    </View>
  );
}
