import { View, Text } from "react-native";
import { useGlobalStyles } from "../theme/hooks";

export function AssistantScreen() {
  const styles = useGlobalStyles();
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Assistente</Text>
      {/* Área do chatbot */}
    </View>
  );
}
