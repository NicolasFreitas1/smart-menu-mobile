/**
 * Configuração da aplicação
 */

export const APP_CONFIG = {
  name: 'Smart Menu',
  version: '1.0.0',
  description: 'App de cardápio digital e reservas',
  
  // UUID do restaurante na sua API
  // Substitua pelo UUID real do seu restaurante
  restaurantId: "4a94dbcc-b9b7-470c-9a47-c61062f66579", // Exemplo de UUID
  
  // Configurações de notificação
  notification: {
    icon: './assets/icon.png',
    color: '#10b981', // Verde principal
    defaultSound: true,
    defaultPriority: 'normal' as const,
  },
  
  // Configurações de branding
  branding: {
    primaryColor: '#10b981',
    secondaryColor: '#f59e0b',
    accentColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
  },
  
  // Configurações de desenvolvimento
  development: {
    enableTestButtons: true,
    enableDebugLogs: true,
    enableMockData: true,
  },
  
  // Configurações de produção
  production: {
    enableTestButtons: false,
    enableDebugLogs: false,
    enableMockData: false,
  },
};

// Configuração baseada no ambiente
export const getAppConfig = () => {
  const isDevelopment = __DEV__;
  return {
    ...APP_CONFIG,
    ...(isDevelopment ? APP_CONFIG.development : APP_CONFIG.production),
  };
};

// Configurações específicas por plataforma
export const PLATFORM_CONFIG = {
  ios: {
    bundleIdentifier: 'com.yourcompany.smartmenumobile',
    supportsTablet: true,
    userInterfaceStyle: 'automatic' as const,
  },
  android: {
    package: 'com.yourcompany.smartmenumobile',
    userInterfaceStyle: 'automatic' as const,
    edgeToEdgeEnabled: true,
  },
  web: {
    favicon: './assets/favicon.png',
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
  const id = APP_CONFIG.restaurantId;

  if (!isValidUUID(id)) {
    console.warn("⚠️ Restaurant ID não é um UUID válido:", id);
    console.warn("💡 Configure um UUID válido em src/config/app-config.ts");
  }

  return id;
};
