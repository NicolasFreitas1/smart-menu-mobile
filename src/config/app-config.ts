// Configuração da aplicação
export const appConfig = {
  // UUID do restaurante na sua API
  // Substitua pelo UUID real do seu restaurante
  restaurantId: "4a94dbcc-b9b7-470c-9a47-c61062f66579", // Exemplo de UUID

  // Configurações da API
  api: {
    timeout: 10000,
    retryAttempts: 3,
  },

  // Configurações do app
  app: {
    name: "Smart Menu",
    version: "1.0.0",
  },
};

// Função para validar UUID
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Função para obter o restaurant ID configurado
export const getRestaurantId = (): string => {
  const id = appConfig.restaurantId;

  if (!isValidUUID(id)) {
    console.warn("⚠️ Restaurant ID não é um UUID válido:", id);
    console.warn("💡 Configure um UUID válido em src/config/app-config.ts");
  }

  return id;
};
