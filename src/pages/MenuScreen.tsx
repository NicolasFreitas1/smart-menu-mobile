import { View, Text } from "react-native";
import { useGlobalStyles } from "../theme/hooks";

export function MenuScreen() {
  const styles = useGlobalStyles();
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Cardápio</Text>
      {/* Filtro de categorias */}
      {/* Lista de produtos (cards) */}
    </View>
  );
}
