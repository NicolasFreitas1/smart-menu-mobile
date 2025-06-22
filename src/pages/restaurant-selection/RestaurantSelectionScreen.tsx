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
import { ThemeToggle } from "../../theme/theme-toggle";
import Icon from "react-native-vector-icons/Feather";

export function RestaurantSelectionScreen() {
  const { colors } = useTheme();
  const styles = useGlobalStyles();
  const { saveSelectedRestaurant } = useRestaurant();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setIsLoading(true);
      const result = await restaurantService.getAllRestaurants();
      setRestaurants(result);
    } catch (error) {
      console.error("Erro ao carregar restaurantes:", error);
      Alert.alert("Erro", "Não foi possível carregar os restaurantes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestaurantSelect = async (restaurant: Restaurant) => {
    try {
      // Salvar restaurante selecionado no contexto
      await saveSelectedRestaurant(restaurant);

      // O MainNavigator irá automaticamente navegar para MainApp
      // quando hasSelectedRestaurant mudar para true
    } catch (error) {
      console.error("Erro ao selecionar restaurante:", error);
      Alert.alert("Erro", "Não foi possível selecionar o restaurante");
    }
  };

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.address?.city
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      restaurant.address?.state
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

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
      {/* Header com ThemeToggle */}
      <View style={localStyles.header}>
        <View style={localStyles.headerContent}>
          <Text
            style={[
              styles.title,
              { fontSize: 28, fontWeight: "700", textAlign: "center" },
            ]}
          >
            Escolha seu Restaurante
          </Text>
          <Text
            style={[styles.mutedText, { textAlign: "center", marginTop: 8 }]}
          >
            Selecione o restaurante onde você deseja fazer seu pedido
          </Text>
        </View>
        <View style={localStyles.themeToggleContainer}>
          <ThemeToggle />
        </View>
      </View>

      <ScrollView
        style={localStyles.scrollView}
        contentContainerStyle={localStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            filteredRestaurants.map((restaurant) => (
              <TouchableOpacity
                key={restaurant.id}
                style={[
                  localStyles.restaurantCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => handleRestaurantSelect(restaurant)}
                activeOpacity={0.7}
              >
                <View style={localStyles.restaurantInfo}>
                  <Text
                    style={[styles.title, { fontSize: 18, fontWeight: "600" }]}
                  >
                    {restaurant.name}
                  </Text>
                  {(restaurant.address?.city || restaurant.address?.state) && (
                    <Text style={[styles.mutedText, { marginTop: 4 }]}>
                      {[restaurant.address?.city, restaurant.address?.state]
                        .filter(Boolean)
                        .join(", ")}
                    </Text>
                  )}
                </View>
                <Icon
                  name="chevron-right"
                  size={20}
                  color={colors.mutedForeground}
                />
              </TouchableOpacity>
            ))
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
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  themeToggleContainer: {
    marginLeft: 16,
    marginTop: 4,
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
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
});
