import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useGlobalStyles } from "../../theme/hooks";
import { testConnection } from "../../lib/axios";

export function IPConfig() {
  const styles = useGlobalStyles();
  const [ip, setIp] = useState("192.168.1.100");
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);

    try {
      const isConnected = await testConnection();

      if (isConnected) {
        Alert.alert(
          "✅ Sucesso!",
          `Conexão estabelecida com ${ip}:3000\n\nAgora você pode usar sua API real!`
        );
      } else {
        Alert.alert(
          "❌ Falha na conexão",
          `Não foi possível conectar com ${ip}:3000\n\nVerifique:\n• Se sua API está rodando\n• Se o IP está correto\n• Se o firewall permite a conexão`
        );
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao testar conexão");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <View style={[styles.card, { margin: 16, padding: 16 }]}>
      <Text
        style={[
          styles.text,
          { fontSize: 18, fontWeight: "600", marginBottom: 16 },
        ]}
      >
        🔧 Configuração da API
      </Text>

      <Text style={[styles.mutedText, { marginBottom: 8 }]}>
        IP da sua máquina (onde a API está rodando):
      </Text>

      <TextInput
        style={[
          styles.card,
          {
            padding: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#E2E8F0",
          },
        ]}
        value={ip}
        onChangeText={setIp}
        placeholder="Ex: 192.168.1.100"
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: "#48BB78",
            paddingVertical: 12,
            alignItems: "center",
          },
        ]}
        onPress={handleTestConnection}
        disabled={isTesting}
      >
        <Text style={[styles.text, { color: "#FFFFFF", fontWeight: "600" }]}>
          {isTesting ? "🔍 Testando..." : "🔍 Testar Conexão"}
        </Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.mutedText,
          { fontSize: 12, marginTop: 12, textAlign: "center" },
        ]}
      >
        Para descobrir seu IP, abra o cmd e digite: ipconfig
      </Text>
    </View>
  );
}
