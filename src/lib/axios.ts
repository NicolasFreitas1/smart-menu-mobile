import axios from "axios";
import { Platform } from "react-native";
import { logger } from '../utils/logger';

// Configuração de IP para diferentes ambientes
const getBaseURL = () => {
  // Para desenvolvimento, você pode alterar este IP conforme necessário
  const DEV_IP = "192.168.10.3"; // Altere para o IP da sua máquina

  if (Platform.OS === "web") {
    // Na web, localhost funciona
    return "http://localhost:3000";
  } else {
    // No mobile, use o IP da sua máquina
    return `http://${DEV_IP}:3000`;
  }
};

// Configuração do axios com timeout
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, // 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de requisição
api.interceptors.request.use(
  (config) => {
    logger.debug('🌐 Requisição:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    logger.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    logger.debug('✅ Resposta:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      logger.error("❌ Erro na resposta:", error.response.status, error.response.data);
    } else if (error.request) {
      logger.error("❌ Erro na requisição (timeout/conexão):", error.message);
    } else {
      logger.error("❌ Erro:", error.message);
    }

    return Promise.reject(error);
  }
);

// Função para testar a conexão
export const testConnection = async () => {
  try {
    logger.info("🔍 Testando conexão com:", getBaseURL());
    const response = await api.get("/health");
    logger.success("✅ Conexão bem-sucedida:", response.data);
    return true;
  } catch (error: any) {
    logger.error("❌ Falha na conexão:", error.message);
    return false;
  }
};

export { api };
