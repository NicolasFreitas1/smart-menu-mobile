import axios from "axios";
import { Platform } from "react-native";

// Configuração de IP para diferentes ambientes
const getBaseURL = () => {
  // Para desenvolvimento, você pode alterar este IP conforme necessário
  const DEV_IP = "192.168.10.6"; // Altere para o IP da sua máquina

  if (Platform.OS === "web") {
    // Na web, localhost funciona
    return "http://localhost:3000";
  } else {
    // No mobile, use o IP da sua máquina
    return `http://${DEV_IP}:3000`;
  }
};

export const api = axios.create({
  baseURL: "http://192.168.10.10:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Erro na resposta:", error.response.data);
    } else if (error.request) {
      console.error("Erro na requisição:", error.request);
    } else {
      console.error("Erro:", error.message);
    }

    return Promise.reject(error);
  }
);

// Função para testar a conexão
export const testConnection = async () => {
  try {
    console.log("🔍 Testando conexão com:", getBaseURL());
    const response = await api.get("/health");
    console.log("✅ Conexão bem-sucedida:", response.data);
    return true;
  } catch (error: any) {
    console.error("❌ Falha na conexão:", error.message);
    return false;
  }
};
