/**
 * Sistema de logging condicional para produção
 */

interface LoggerConfig {
  enableLogs: boolean;
  enableErrors: boolean;
  enableWarnings: boolean;
  enableDebug: boolean;
}

// Configuração baseada no ambiente
const getLoggerConfig = (): LoggerConfig => {
  if (__DEV__) {
    return {
      enableLogs: true,
      enableErrors: true,
      enableWarnings: true,
      enableDebug: true,
    };
  }
  
  // Em produção, apenas erros críticos
  return {
    enableLogs: false,
    enableErrors: true,
    enableWarnings: false,
    enableDebug: false,
  };
};

const config = getLoggerConfig();

export const logger = {
  log: (...args: any[]) => {
    if (config.enableLogs) {
      console.log(...args);
    }
  },
  
  error: (...args: any[]) => {
    if (config.enableErrors) {
      console.error(...args);
      // Em produção, aqui você pode enviar para um serviço de monitoramento
      // como Sentry, Crashlytics, etc.
    }
  },
  
  warn: (...args: any[]) => {
    if (config.enableWarnings) {
      console.warn(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (config.enableDebug) {
      console.log('[DEBUG]', ...args);
    }
  },
  
  info: (...args: any[]) => {
    if (config.enableLogs) {
      console.log('[INFO]', ...args);
    }
  },
  
  success: (...args: any[]) => {
    if (config.enableLogs) {
      console.log('✅', ...args);
    }
  },
  
  warning: (...args: any[]) => {
    if (config.enableWarnings) {
      console.warn('⚠️', ...args);
    }
  },
  
  critical: (...args: any[]) => {
    // Erros críticos sempre são logados
    console.error('🚨 CRÍTICO:', ...args);
    // Aqui você pode implementar notificação para o time
  }
};

// Função para configurar logger manualmente (útil para testes)
export const configureLogger = (newConfig: Partial<LoggerConfig>) => {
  Object.assign(config, newConfig);
};

// Função para verificar se logs estão habilitados
export const isLoggingEnabled = () => config.enableLogs;
export const isErrorLoggingEnabled = () => config.enableErrors;
export const isWarningLoggingEnabled = () => config.enableWarnings;
export const isDebugLoggingEnabled = () => config.enableDebug; 