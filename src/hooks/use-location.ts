import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { LocationData } from '../types/assistant';
import { locationService } from '../services/location';
import { Restaurant } from '../domain/restaurant';
import { restaurantService } from '../services/restaurant';

interface RestaurantLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export function useLocation() {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<RestaurantLocation[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Solicitar permissão de localização
  const requestLocationPermission = async () => {
    try {
      setIsLoadingLocation(true);
      const granted = await locationService.requestLocationPermission();
      setHasPermission(granted);
      
      if (granted) {
        await getCurrentLocation();
      }
      
      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão de localização:', error);
      Alert.alert('Erro', 'Não foi possível acessar sua localização');
      return false;
    } finally {
      setIsLoadingLocation(false);
    }
  };

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
  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const location = await locationService.getCurrentLocation();
      setCurrentLocation(location);
      return location;
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      Alert.alert('Erro', 'Não foi possível obter sua localização');
      return null;
    } finally {
      setIsLoadingLocation(false);
    }
  };

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

  // Buscar restaurantes por proximidade
  const getNearbyRestaurants = async (
    restaurants: Restaurant[],
    maxDistance: number = 5000 // 5km por padrão
  ): Promise<Restaurant[]> => {
    if (!currentLocation) {
      console.log('📍 Localização não disponível para busca por proximidade');
      return restaurants;
    }

    try {
      // Usar a nova API de proximidade do backend
      const proximityResult = await restaurantService.getRestaurantsByProximity(
        currentLocation.latitude,
        currentLocation.longitude,
        maxDistance / 1000, // Converter para km
        1, // página 1
        50 // máximo de resultados
      );

      // Se a API retornou restaurantes, usar eles
      if (proximityResult.restaurants.length > 0) {
        console.log('📍 Restaurantes encontrados por proximidade:', proximityResult.restaurants.length);
        return proximityResult.restaurants;
      }

      // Fallback: filtrar restaurantes que têm coordenadas
      const restaurantsWithCoordinates = restaurants.filter(
        restaurant => restaurant.coordinates
      );

      if (restaurantsWithCoordinates.length === 0) {
        console.log('📍 Nenhum restaurante com coordenadas encontrado');
        return restaurants;
      }

      // Buscar restaurantes próximos usando o serviço local
      const nearbyRestaurants = await locationService.getNearbyRestaurants(
        currentLocation,
        maxDistance
      );

      // Mapear IDs dos restaurantes próximos
      const nearbyIds = nearbyRestaurants.map(r => r.id);

      // Ordenar restaurantes: próximos primeiro, depois os demais
      const sortedRestaurants = [...restaurants].sort((a, b) => {
        const aIsNearby = a.coordinates && nearbyIds.includes(a.id);
        const bIsNearby = b.coordinates && nearbyIds.includes(b.id);
        
        if (aIsNearby && !bIsNearby) return -1;
        if (!aIsNearby && bIsNearby) return 1;
        return 0;
      });

      return sortedRestaurants;
    } catch (error) {
      console.error('Erro ao buscar restaurantes próximos:', error);
      return restaurants;
    }
  };

  // Calcular distância entre localização atual e restaurante
  const calculateDistance = (restaurant: Restaurant): number | null => {
    if (!currentLocation || !restaurant.coordinates) {
      return null;
    }

    const R = 6371e3; // Raio da Terra em metros
    const φ1 = (currentLocation.latitude * Math.PI) / 180;
    const φ2 = (restaurant.coordinates.latitude * Math.PI) / 180;
    const Δφ = ((restaurant.coordinates.latitude - currentLocation.latitude) * Math.PI) / 180;
    const Δλ = ((restaurant.coordinates.longitude - currentLocation.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance;
  };

  // Formatar distância para exibição
  const formatDistance = (distance: number): string => {
    if (isNaN(distance) || distance === null || distance === undefined) {
      return 'N/A';
    }
    
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
    isLoadingLocation,
    error,
    
    // Actions
    requestLocationPermission,
    startLocationTracking,
    stopLocationTracking,
    getCurrentLocation,
    setupRestaurantGeofencing,
    getNearbyRestaurants,
    checkTrackingStatus,
    
    // Utilities
    calculateDistance,
    formatDistance,
  };
} 