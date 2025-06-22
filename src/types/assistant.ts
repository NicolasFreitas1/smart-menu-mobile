export interface Option {
  label: string;
  value: string;
}

export interface Step {
  id: string;
  question: string;
  options: Option[];
  nextStep?: string;
  end?: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Tipos para funcionalidades diferenciais
export interface Reservation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  partySize: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface GeofenceEvent {
  id: string;
  restaurantId: string;
  restaurantName: string;
  eventType: 'enter' | 'exit';
  location: LocationData;
  timestamp: number;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  data?: any;
  type: 'promotion' | 'reservation_reminder' | 'order_update' | 'geofence' | 'general';
  scheduledFor?: string;
  isRead: boolean;
  createdAt: string;
}

export interface OfflineSyncData {
  lastSync: string;
  dishes: any[];
  categories: any[];
  restaurants: any[];
  pendingActions: any[];
} 