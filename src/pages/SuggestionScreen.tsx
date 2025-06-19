import { View, Text, Button } from "react-native";
import { useGlobalStyles } from "../theme/hooks";

export function SuggestionScreen() {
  const styles = useGlobalStyles();
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Sugestão</Text>
      {/* Filtro de categorias */}
      <Button title="Gerar pedido aleatório" onPress={() => {}} />
      {/* Exibição do pedido gerado */}
    </View>
  );
}
