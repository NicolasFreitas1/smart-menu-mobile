import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { LocationData } from '../types/assistant';
import { locationService } from '../services/location';

interface RestaurantLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export const useLocation = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<RestaurantLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Solicitar permissão de localização
  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const granted = await locationService.requestLocationPermission();
      setHasPermission(granted);
      
      if (granted) {
        // Obter localização atual após permissão concedida
        const location = await locationService.getCurrentLocation();
        setCurrentLocation(location);
      }
      
      return granted;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao solicitar permissão';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Iniciar monitoramento de localização
  const startLocationTracking = useCallback(async (): Promise<void> => {
    if (!hasPermission) {
      const granted = await requestLocationPermission();
      if (!granted) return;
    }

    try {
      await locationService.startLocationTracking();
      setIsTracking(true);
      console.log('📍 Monitoramento de localização iniciado');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao iniciar monitoramento';
      setError(errorMessage);
      Alert.alert('Erro', errorMessage);
    }
  }, [hasPermission, requestLocationPermission]);

  // Parar monitoramento de localização
  const stopLocationTracking = useCallback(async (): Promise<void> => {
    try {
      await locationService.stopLocationTracking();
      setIsTracking(false);
      console.log('📍 Monitoramento de localização parado');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao parar monitoramento';
      setError(errorMessage);
    }
  }, []);

  // Obter localização atual
  const getCurrentLocation = useCallback(async (): Promise<LocationData | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const location = await locationService.getCurrentLocation();
      setCurrentLocation(location);
      return location;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao obter localização';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Configurar restaurantes para geofencing
  const setupRestaurantGeofencing = useCallback(async (
    restaurants: RestaurantLocation[]
  ): Promise<void> => {
    try {
      await locationService.setupRestaurantGeofencing(restaurants);
      console.log(`🏪 ${restaurants.length} restaurantes configurados para geofencing`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao configurar geofencing';
      setError(errorMessage);
    }
  }, []);

  // Buscar restaurantes próximos
  const findNearbyRestaurants = useCallback(async (
    maxDistance: number = 5000
  ): Promise<RestaurantLocation[]> => {
    if (!currentLocation) {
      Alert.alert('Localização', 'Não foi possível obter sua localização atual.');
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const nearby = await locationService.getNearbyRestaurants(currentLocation, maxDistance);
      setNearbyRestaurants(nearby);
      return nearby;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar restaurantes próximos';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [currentLocation]);

  // Verificar se está próximo de um restaurante específico
  const isNearRestaurant = useCallback((
    restaurantLat: number,
    restaurantLng: number,
    maxDistance: number = 500
  ): boolean => {
    if (!currentLocation) return false;

    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      restaurantLat,
      restaurantLng
    );

    return distance <= maxDistance;
  }, [currentLocation]);

  // Calcular distância entre dois pontos
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
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
  };

  // Formatar distância para exibição
  const formatDistance = (distance: number): string => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  // Verificar status do monitoramento
  const checkTrackingStatus = useCallback((): boolean => {
    const status = locationService.isLocationTrackingActive();
    setIsTracking(status);
    return status;
  }, []);

  // Inicializar serviço de localização
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        // Verificar se já tem permissão
        const status = locationService.isLocationTrackingActive();
        setIsTracking(status);
        
        // Tentar obter localização atual
        const location = await locationService.getCurrentLocation();
        if (location) {
          setCurrentLocation(location);
          setHasPermission(true);
        }
      } catch (error) {
        console.log('Localização não disponível na inicialização');
      }
    };

    initializeLocation();
  }, []);

  return {
    // State
    currentLocation,
    isTracking,
    hasPermission,
    nearbyRestaurants,
    isLoading,
    error,
    
    // Actions
    requestLocationPermission,
    startLocationTracking,
    stopLocationTracking,
    getCurrentLocation,
    setupRestaurantGeofencing,
    findNearbyRestaurants,
    checkTrackingStatus,
    
    // Utilities
    isNearRestaurant,
    calculateDistance,
    formatDistance,
  };
}; 