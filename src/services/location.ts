import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';
import { storageService } from './storage';
import { pushNotificationService } from './push-notifications';
import { LocationData, GeofenceEvent } from '../types/assistant';

interface RestaurantLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // raio em metros para geofencing
}

class LocationService {
  private hasLocationPermission = false;
  private locationSubscription: Location.LocationSubscription | null = null;
  private isTracking = false;
  private restaurantLocations: RestaurantLocation[] = [];

  // Solicitar permissão de localização
  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      this.hasLocationPermission = status === 'granted';
      
      if (!this.hasLocationPermission) {
        Alert.alert(
          'Permissão de Localização',
          'Para receber promoções por proximidade, precisamos da permissão de localização.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Configurações', onPress: () => this.openSettings() }
          ]
        );
      }
      
      return this.hasLocationPermission;
    } catch (error) {
      console.error('Erro ao solicitar permissão de localização:', error);
      return false;
    }
  }

  // Abrir configurações do dispositivo
  private openSettings() {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Configurações',
        'Vá para Configurações > Privacidade e Segurança > Localização e ative o acesso para este app.'
      );
    } else {
      // Implementar abertura das configurações do app no Android
    }
  }

  // Configurar restaurantes para geofencing
  async setupRestaurantGeofencing(restaurants: RestaurantLocation[]): Promise<void> {
    this.restaurantLocations = restaurants;
    
    // Salvar configurações no storage
    await storageService.setItem('restaurant_locations', restaurants);
  }

  // Iniciar monitoramento de localização
  async startLocationTracking(): Promise<void> {
    if (!this.hasLocationPermission) {
      const granted = await this.requestLocationPermission();
      if (!granted) return;
    }

    if (this.isTracking) {
      console.log('📍 Monitoramento de localização já está ativo');
      return;
    }

    try {
      // Configurar opções de localização
      const locationOptions: Location.LocationTaskOptions = {
        accuracy: Location.Accuracy.High,
        timeInterval: 30000, // 30 segundos
        distanceInterval: 50, // 50 metros
        foregroundService: {
          notificationTitle: 'Smart Menu',
          notificationBody: 'Monitorando localização para promoções',
        },
      };

      // Iniciar monitoramento em background
      this.locationSubscription = await Location.watchPositionAsync(
        locationOptions,
        (location) => this.handleLocationUpdate(location)
      );

      this.isTracking = true;
      console.log('📍 Monitoramento de localização iniciado');
    } catch (error) {
      console.error('Erro ao iniciar monitoramento de localização:', error);
    }
  }

  // Parar monitoramento de localização
  async stopLocationTracking(): Promise<void> {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
    this.isTracking = false;
    console.log('📍 Monitoramento de localização parado');
  }

  // Manipular atualização de localização
  private async handleLocationUpdate(location: Location.LocationObject): Promise<void> {
    const locationData: LocationData = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || undefined,
      timestamp: location.timestamp,
    };

    // Verificar se está próximo de algum restaurante
    await this.checkProximityToRestaurants(locationData);
  }

  // Verificar proximidade com restaurantes
  private async checkProximityToRestaurants(currentLocation: LocationData): Promise<void> {
    for (const restaurant of this.restaurantLocations) {
      const distance = this.calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        restaurant.latitude,
        restaurant.longitude
      );

      const isInsideGeofence = distance <= restaurant.radius;
      const wasInsideGeofence = await this.wasInsideGeofence(restaurant.id);

      if (isInsideGeofence && !wasInsideGeofence) {
        // Usuário entrou no geofence
        await this.handleGeofenceEnter(restaurant, currentLocation);
      } else if (!isInsideGeofence && wasInsideGeofence) {
        // Usuário saiu do geofence
        await this.handleGeofenceExit(restaurant, currentLocation);
      }
    }
  }

  // Calcular distância entre dois pontos (fórmula de Haversine)
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Verificar se estava dentro do geofence anteriormente
  private async wasInsideGeofence(restaurantId: string): Promise<boolean> {
    try {
      const geofenceEvents = await this.getGeofenceEvents();
      const lastEvent = geofenceEvents
        .filter(event => event.restaurantId === restaurantId)
        .sort((a, b) => b.timestamp - a.timestamp)[0];

      return lastEvent?.eventType === 'enter';
    } catch (error) {
      return false;
    }
  }

  // Manipular entrada no geofence
  private async handleGeofenceEnter(
    restaurant: RestaurantLocation,
    location: LocationData
  ): Promise<void> {
    const event: GeofenceEvent = {
      id: `geofence-${Date.now()}`,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      eventType: 'enter',
      location,
      timestamp: Date.now(),
    };

    // Salvar evento
    await this.saveGeofenceEvent(event);

    // Enviar notificação de promoção
    await pushNotificationService.sendProximityNotification(
      restaurant.name,
      `Você está próximo do ${restaurant.name}! Que tal fazer uma reserva ou pedir delivery?`
    );

    console.log(`📍 Entrou no geofence do ${restaurant.name}`);
  }

  // Manipular saída do geofence
  private async handleGeofenceExit(
    restaurant: RestaurantLocation,
    location: LocationData
  ): Promise<void> {
    const event: GeofenceEvent = {
      id: `geofence-${Date.now()}`,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      eventType: 'exit',
      location,
      timestamp: Date.now(),
    };

    // Salvar evento
    await this.saveGeofenceEvent(event);

    console.log(`📍 Saiu do geofence do ${restaurant.name}`);
  }

  // Salvar evento de geofence
  private async saveGeofenceEvent(event: GeofenceEvent): Promise<void> {
    try {
      const events = await this.getGeofenceEvents();
      events.push(event);
      
      // Manter apenas os últimos 100 eventos
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      await storageService.setItem('geofence_events', events);
    } catch (error) {
      console.error('Erro ao salvar evento de geofence:', error);
    }
  }

  // Buscar eventos de geofence do storage
  private async getGeofenceEvents(): Promise<GeofenceEvent[]> {
    try {
      const eventsJson = await storageService.getItem<string>('geofence_events');
      return eventsJson ? JSON.parse(eventsJson) : [];
    } catch (error) {
      console.error('Erro ao buscar eventos de geofence:', error);
      return [];
    }
  }

  // Obter localização atual
  async getCurrentLocation(): Promise<LocationData | null> {
    if (!this.hasLocationPermission) {
      const granted = await this.requestLocationPermission();
      if (!granted) return null;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || undefined,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Erro ao obter localização atual:', error);
      return null;
    }
  }

  // Verificar se o monitoramento está ativo
  isLocationTrackingActive(): boolean {
    return this.isTracking;
  }

  // Obter restaurantes próximos
  async getNearbyRestaurants(userLocation: LocationData, maxDistance: number = 5000): Promise<RestaurantLocation[]> {
    const nearby: RestaurantLocation[] = [];

    for (const restaurant of this.restaurantLocations) {
      const distance = this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        restaurant.latitude,
        restaurant.longitude
      );

      if (distance <= maxDistance) {
        nearby.push(restaurant);
      }
    }

    return nearby;
  }
}

export const locationService = new LocationService(); 