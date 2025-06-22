/**
 * Configuração personalizada para notificações
 */

export interface NotificationStyle {
  icon: string;
  color: string;
  sound: string;
  priority: 'default' | 'normal' | 'high';
  badge: boolean;
  vibration: boolean;
}

export const NOTIFICATION_STYLES: Record<string, NotificationStyle> = {
  reservation_created: {
    icon: '🎉',
    color: '#10b981', // green-500
    sound: 'notification_success.wav',
    priority: 'high',
    badge: true,
    vibration: true,
  },
  reservation_reminder: {
    icon: '⏰',
    color: '#f59e0b', // amber-500
    sound: 'notification_reminder.wav',
    priority: 'high',
    badge: true,
    vibration: true,
  },
  reservation_confirmed: {
    icon: '✅',
    color: '#10b981', // green-500
    sound: 'notification_success.wav',
    priority: 'normal',
    badge: true,
    vibration: false,
  },
  reservation_cancelled: {
    icon: '❌',
    color: '#ef4444', // red-500
    sound: 'notification_error.wav',
    priority: 'normal',
    badge: false,
    vibration: false,
  },
  proximity: {
    icon: '📍',
    color: '#3b82f6', // blue-500
    sound: 'notification_proximity.wav',
    priority: 'normal',
    badge: false,
    vibration: true,
  },
  order_update: {
    icon: '📋',
    color: '#8b5cf6', // violet-500
    sound: 'notification_update.wav',
    priority: 'normal',
    badge: true,
    vibration: false,
  },
  promotion: {
    icon: '🎊',
    color: '#ec4899', // pink-500
    sound: 'notification_promotion.wav',
    priority: 'normal',
    badge: false,
    vibration: true,
  },
  test: {
    icon: '🧪',
    color: '#6b7280', // gray-500
    sound: 'default',
    priority: 'default',
    badge: false,
    vibration: false,
  },
};

// Configurações de som personalizadas
export const NOTIFICATION_SOUNDS = {
  default: 'default',
  success: 'notification_success.wav',
  reminder: 'notification_reminder.wav',
  proximity: 'notification_proximity.wav',
  update: 'notification_update.wav',
  promotion: 'notification_promotion.wav',
  error: 'notification_error.wav',
};

// Configurações de vibração
export const VIBRATION_PATTERNS = {
  short: [0, 100],
  medium: [0, 200, 100, 200],
  long: [0, 300, 100, 300, 100, 300],
  urgent: [0, 100, 50, 100, 50, 100, 50, 100],
};

// Configurações de badge
export const BADGE_CONFIG = {
  enabled: true,
  autoClear: true,
  maxCount: 99,
};

// Configurações de prioridade
export const PRIORITY_CONFIG = {
  reservation_reminder: 'high',
  reservation_created: 'high',
  order_update: 'normal',
  proximity: 'normal',
  promotion: 'normal',
  test: 'default',
};

// Mensagens padrão personalizadas
export const NOTIFICATION_MESSAGES = {
  reservation_created: {
    title: 'Reserva Criada com Sucesso! 🎉',
    body: 'Sua reserva foi confirmada e adicionada ao seu calendário.',
  },
  reservation_reminder: {
    title: 'Lembrete de Reserva ⏰',
    body: 'Sua reserva está chegando! Não se esqueça.',
  },
  reservation_confirmed: {
    title: 'Reserva Confirmada! ✅',
    body: 'O restaurante confirmou sua reserva.',
  },
  reservation_cancelled: {
    title: 'Reserva Cancelada ❌',
    body: 'Sua reserva foi cancelada com sucesso.',
  },
  proximity: {
    title: 'Você está próximo! 📍',
    body: 'Que tal fazer uma reserva ou pedir delivery?',
  },
  order_update: {
    title: 'Atualização do Pedido 📋',
    body: 'Seu pedido foi atualizado.',
  },
  promotion: {
    title: 'Promoção Especial! 🎊',
    body: 'Aproveite nossa oferta exclusiva!',
  },
};

// Configurações de agendamento
export const SCHEDULING_CONFIG = {
  reminder_intervals: {
    one_day: 24 * 60 * 60 * 1000, // 1 dia
    one_hour: 60 * 60 * 1000, // 1 hora
    fifteen_minutes: 15 * 60 * 1000, // 15 minutos
  },
  max_scheduled_notifications: 10,
  auto_cleanup_old: true,
  cleanup_after_days: 7,
};

// Configurações de geofencing
export const GEOFENCING_CONFIG = {
  default_radius: 500, // metros
  min_radius: 100,
  max_radius: 2000,
  check_interval: 30000, // 30 segundos
  notification_cooldown: 300000, // 5 minutos
};

// Configurações de teste
export const TEST_CONFIG = {
  enable_test_buttons: true,
  test_notification_delay: 5000, // 5 segundos
  auto_clear_test_notifications: true,
  test_sound_enabled: true,
}; 