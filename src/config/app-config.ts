/**
 * Configuração da aplicação
 */

// Função para obter variáveis de ambiente de forma segura
const getEnvVar = (key: string, defaultValue: string): string => {
  // Em React Native, variáveis de ambiente são limitadas
  // Por enquanto, usamos valores padrão seguros
  return defaultValue;
};

export const APP_CONFIG = {
  name: 'Smart Menu',
  version: '1.0.0',
  description: 'App de cardápio digital e reservas',
  
  // UUID do restaurante - CONFIGURAR COM UUID REAL
  // ⚠️ IMPORTANTE: Substitua pelo UUID real do seu restaurante
  restaurantId: getEnvVar('RESTAURANT_ID', '4a94dbcc-b9b7-470c-9a47-c61062f66579'),
  
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
    enableTestButtons: false,
    enableDebugLogs: false,
    enableMockData: false,
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
    console.warn("🔧 Exemplo de UUID válido: 123e4567-e89b-12d3-a456-426614174000");
  }

  return id;
};

// Função para validar configuração completa
export const validateAppConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validar Restaurant ID
  if (!isValidUUID(APP_CONFIG.restaurantId)) {
    errors.push('Restaurant ID não é um UUID válido');
  }
  
  // Validar versão
  if (!APP_CONFIG.version || APP_CONFIG.version === '0.0.0') {
    errors.push('Versão do app não configurada');
  }
  
  // Validar nome
  if (!APP_CONFIG.name || APP_CONFIG.name.trim() === '') {
    errors.push('Nome do app não configurado');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
