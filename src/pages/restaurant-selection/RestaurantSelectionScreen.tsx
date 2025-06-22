import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useTheme } from "../../theme/theme-provider";
import { useGlobalStyles } from "../../theme/hooks";
import { SafeContainer } from "../../components/ui/safe-container";
import { Restaurant } from "../../domain/restaurant";
import { restaurantService } from "../../services/restaurant";
import { useRestaurant } from "../../context/RestaurantContext";
import { useLocation } from "../../hooks/use-location";
import { ThemeToggle } from "../../theme/theme-toggle";
import Icon from "react-native-vector-icons/Feather";

export function RestaurantSelectionScreen() {
  const { colors } = useTheme();
  const styles = useGlobalStyles();
  const { saveSelectedRestaurant } = useRestaurant();
  const {
    currentLocation,
    isLoadingLocation,
    hasPermission,
    requestLocationPermission,
    getNearbyRestaurants,
    calculateDistance,
    formatDistance,
  } = useLocation();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByProximity, setSortByProximity] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    filterAndSortRestaurants();
  }, [restaurants, searchTerm, sortByProximity, currentLocation]);

  const loadRestaurants = async () => {
    try {
      setIsLoading(true);
      console.log("🔄 Carregando restaurantes...");
      const result = await restaurantService.getAllRestaurants();

      // Validar se o resultado é um array
      if (!Array.isArray(result)) {
        console.error("❌ Resultado não é um array:", result);
        setRestaurants([]);
        return;
      }

      console.log(`✅ ${result.length} restaurantes carregados`);
      setRestaurants(result);
    } catch (error) {
      console.error("Erro ao carregar restaurantes:", error);
      Alert.alert("Erro", "Não foi possível carregar os restaurantes");
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortRestaurants = async () => {
    let filtered = restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address?.city
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        restaurant.address?.state
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    // Se ordenação por proximidade estiver ativada e temos localização
    if (sortByProximity && currentLocation) {
      filtered = await getNearbyRestaurants(filtered);
    }

    setFilteredRestaurants(filtered);
  };

  const handleLocationPermission = async () => {
    const granted = await requestLocationPermission();
    if (granted) {
      setSortByProximity(true);
    }
  };

  const handleRestaurantSelect = async (restaurant: Restaurant) => {
    try {
      await saveSelectedRestaurant(restaurant);
    } catch (error) {
      console.error("Erro ao selecionar restaurante:", error);
      Alert.alert("Erro", "Não foi possível selecionar o restaurante");
    }
  };

  if (isLoading) {
    return (
      <SafeContainer style={localStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.mutedText, { marginTop: 16 }]}>
          Carregando restaurantes...
        </Text>
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      {/* ThemeToggle no canto superior direito */}
      <View style={localStyles.themeToggleContainer}>
        <ThemeToggle />
      </View>

      {/* Header centralizado */}
      <View style={localStyles.header}>
        <Text
          style={[
            styles.title,
            { fontSize: 28, fontWeight: "700", textAlign: "center" },
          ]}
        >
          Escolha seu Restaurante
        </Text>
        <Text style={[styles.mutedText, { textAlign: "center", marginTop: 8 }]}>
          Selecione o restaurante onde você deseja fazer seu pedido
        </Text>
      </View>

      <ScrollView
        style={localStyles.scrollView}
        contentContainerStyle={localStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Barra de busca */}
        <View style={localStyles.searchContainer}>
          <View
            style={[
              localStyles.searchInput,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Icon name="search" size={20} color={colors.mutedForeground} />
            <TextInput
              style={[
                localStyles.searchInputText,
                { color: colors.foreground },
              ]}
              placeholder="Buscar por nome, cidade ou estado..."
              placeholderTextColor={colors.mutedForeground}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        </View>

        {/* Botão de localização */}
        <View style={localStyles.locationContainer}>
          <TouchableOpacity
            onPress={handleLocationPermission}
            style={[
              localStyles.locationButton,
              {
                backgroundColor: sortByProximity ? colors.primary : colors.card,
                borderColor: colors.border,
              },
            ]}
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? (
              <ActivityIndicator
                size="small"
                color={colors.primaryForeground}
              />
            ) : (
              <Icon
                name={sortByProximity ? "map-pin" : "map-pin"}
                size={20}
                color={
                  sortByProximity ? colors.primaryForeground : colors.foreground
                }
              />
            )}
            <Text
              style={[
                localStyles.locationButtonText,
                {
                  color: sortByProximity
                    ? colors.primaryForeground
                    : colors.foreground,
                },
              ]}
            >
              {sortByProximity
                ? "Ordenar por proximidade"
                : "Usar minha localização"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de restaurantes */}
        <View style={localStyles.restaurantsContainer}>
          {filteredRestaurants.length === 0 ? (
            <View style={localStyles.emptyState}>
              <Icon name="search" size={48} color={colors.mutedForeground} />
              <Text style={[styles.title, { fontSize: 18, marginTop: 16 }]}>
                Nenhum restaurante encontrado
              </Text>
              <Text
                style={[
                  styles.mutedText,
                  { textAlign: "center", marginTop: 8 },
                ]}
              >
                Tente ajustar sua busca
              </Text>
            </View>
          ) : (
            filteredRestaurants.map((restaurant) => {
              const distance = calculateDistance(restaurant);
              const isNearby =
                sortByProximity && distance !== null && distance <= 5000;

              return (
                <TouchableOpacity
                  key={restaurant.id}
                  style={[
                    localStyles.restaurantCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                    isNearby && { borderColor: colors.primary, borderWidth: 2 },
                  ]}
                  onPress={() => handleRestaurantSelect(restaurant)}
                  activeOpacity={0.7}
                >
                  <View style={localStyles.restaurantInfo}>
                    <View style={localStyles.restaurantHeader}>
                      <Text
                        style={[
                          styles.title,
                          {
                            fontSize: 18,
                            fontWeight: "600",
                            flex: 1,
                            marginRight: 8,
                          },
                        ]}
                        numberOfLines={2}
                      >
                        {restaurant.name}
                      </Text>
                      {isNearby && (
                        <View style={localStyles.nearbyBadge}>
                          <Icon
                            name="map-pin"
                            size={12}
                            color={colors.primary}
                          />
                          <Text
                            style={[
                              localStyles.nearbyText,
                              { color: colors.primary },
                            ]}
                          >
                            Próximo
                          </Text>
                        </View>
                      )}
                    </View>
                    {(restaurant.address?.city ||
                      restaurant.address?.state) && (
                      <Text style={[styles.mutedText, { marginTop: 4 }]}>
                        {[restaurant.address?.city, restaurant.address?.state]
                          .filter(Boolean)
                          .join(", ")}
                      </Text>
                    )}
                    {distance !== null && (
                      <Text style={[styles.mutedText, { marginTop: 2 }]}>
                        📍 {formatDistance(distance)} de distância
                      </Text>
                    )}
                  </View>
                  <Icon
                    name="chevron-right"
                    size={20}
                    color={colors.mutedForeground}
                  />
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeContainer>
  );
}

const localStyles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  themeToggleContainer: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 48,
  },
  searchInputText: {
    marginLeft: 12,
    fontSize: 16,
    flex: 1,
  },
  locationContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  locationButtonText: {
    marginLeft: 12,
    fontSize: 16,
  },
  restaurantsContainer: {
    gap: 12,
  },
  restaurantCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  nearbyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    flexShrink: 0,
    minWidth: 60,
  },
  nearbyText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
});
