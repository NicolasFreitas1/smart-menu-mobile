import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useGlobalStyles } from "../../theme/hooks";
import { appConfig, isValidUUID } from "../../config/app-config";
import { restaurantService } from "../../services/restaurant";

export function RestaurantConfig() {
  const styles = useGlobalStyles();
  const [restaurantId, setRestaurantId] = useState(appConfig.restaurantId);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestRestaurant = async () => {
    if (!isValidUUID(restaurantId)) {
      Alert.alert(
        "UUID Inválido",
        "Por favor, insira um UUID válido no formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      );
      return;
    }

    setIsTesting(true);

    try {
      console.log("🔍 Testando restaurante:", restaurantId);
      const restaurant = await restaurantService.getRestaurant(restaurantId);

      Alert.alert(
        "✅ Restaurante Encontrado!",
        `Nome: ${restaurant.name}\nID: ${restaurant.id}\n\nAgora você pode usar este UUID no arquivo de configuração.`
      );
    } catch (error: any) {
      console.error("❌ Erro ao testar restaurante:", error);

      if (error.response?.status === 404) {
        Alert.alert(
          "❌ Restaurante Não Encontrado",
          `O restaurante com ID "${restaurantId}" não foi encontrado na API.\n\nVerifique se o UUID está correto.`
        );
      } else if (error.response?.status === 400) {
        Alert.alert(
          "❌ UUID Inválido",
          "O formato do UUID está incorreto. Use o formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        );
      } else {
        Alert.alert(
          "❌ Erro de Conexão",
          "Não foi possível conectar com a API. Verifique se a API está rodando."
        );
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopyToConfig = () => {
    Alert.alert(
      "📋 Copiar para Configuração",
      `Para usar este UUID, substitua a linha em src/config/app-config.ts:\n\nrestaurantId: "${restaurantId}"`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Entendi", style: "default" },
      ]
    );
  };

  return (
    <View style={[styles.card, { margin: 16, padding: 16 }]}>
      <Text
        style={[
          styles.text,
          { fontSize: 18, fontWeight: "600", marginBottom: 16 },
        ]}
      >
        🏪 Configuração do Restaurante
      </Text>

      <Text style={[styles.mutedText, { marginBottom: 8 }]}>
        UUID do restaurante na sua API:
      </Text>

      <TextInput
        style={[
          styles.card,
          {
            padding: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: isValidUUID(restaurantId) ? "#48BB78" : "#FF6B6B",
            fontFamily: "monospace",
          },
        ]}
        value={restaurantId}
        onChangeText={setRestaurantId}
        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={{ flexDirection: "row", gap: 8 }}>
        <TouchableOpacity
          style={[
            styles.card,
            {
              flex: 1,
              backgroundColor: "#48BB78",
              paddingVertical: 12,
              alignItems: "center",
            },
          ]}
          onPress={handleTestRestaurant}
          disabled={isTesting}
        >
          <Text style={[styles.text, { color: "#FFFFFF", fontWeight: "600" }]}>
            {isTesting ? "🔍 Testando..." : "🔍 Testar Restaurante"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            {
              flex: 1,
              backgroundColor: "#4A90E2",
              paddingVertical: 12,
              alignItems: "center",
            },
          ]}
          onPress={handleCopyToConfig}
        >
          <Text style={[styles.text, { color: "#FFFFFF", fontWeight: "600" }]}>
            📋 Copiar Config
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.mutedText,
          { fontSize: 12, marginTop: 12, textAlign: "center" },
        ]}
      >
        {isValidUUID(restaurantId)
          ? "✅ UUID válido"
          : "❌ UUID inválido - use o formato correto"}
      </Text>
    </View>
  );
}
