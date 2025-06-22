import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useGlobalStyles } from "../../theme/hooks";
import { useTheme } from "../../theme/theme-provider";
import { getRestaurantId } from "../../config/app-config";
import { restaurantService } from "../../services/restaurant";
import { Restaurant } from "../../domain/restaurant";
import { useRestaurant } from "../../context/RestaurantContext";
import { logger } from "../../utils/logger";

export function RestaurantConfig() {
  const styles = useGlobalStyles();
  const { colors } = useTheme();
  const {
    selectedRestaurant,
    saveSelectedRestaurant,
    clearSelectedRestaurant,
  } = useRestaurant();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [tempSelectedRestaurant, setTempSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Função para formatar endereço
  const formatAddress = (address: any) => {
    if (!address) return "";
    return `${address.street}, ${address.number} - ${address.city}/${address.state}`;
  };

  // Função para formatar CEP
  const formatCEP = (cep: string) => {
    if (!cep) return "";
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  // Carrega os restaurantes ao inicializar
  useEffect(() => {
    loadRestaurants();
  }, []);

  // Filtra restaurantes baseado no termo de busca
  useEffect(() => {
    if (!Array.isArray(restaurants)) {
      setFilteredRestaurants([]);
      return;
    }

    if (searchTerm.trim() === "") {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (restaurant.address &&
            (restaurant.address.street
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
              restaurant.address.city
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              restaurant.address.state
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              restaurant.address.cep.includes(searchTerm) ||
              formatCEP(restaurant.address.cep).includes(searchTerm)))
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchTerm, restaurants]);

  const loadRestaurants = async () => {
    try {
      setIsLoadingRestaurants(true);
      logger.info("🔄 Carregando restaurantes...");

      const allRestaurants = await restaurantService.getAllRestaurants();

      // Garantir que allRestaurants seja sempre um array
      const restaurantsArray = Array.isArray(allRestaurants)
        ? allRestaurants
        : [];

      // Validar que cada restaurante tem a estrutura correta
      const validRestaurants = restaurantsArray.filter(
        (restaurant) =>
          restaurant &&
          typeof restaurant === "object" &&
          restaurant.id &&
          restaurant.name &&
          typeof restaurant.id === "string" &&
          typeof restaurant.name === "string"
      );

      logger.info(
        `🏪 Total de restaurantes da API: ${restaurantsArray.length}`
      );
      logger.info(
        `🏪 Restaurantes válidos encontrados: ${validRestaurants.length}`
      );

      setRestaurants(validRestaurants);
      setFilteredRestaurants(validRestaurants);

      // Tenta encontrar o restaurante atual na lista
      const currentRestaurantId = getRestaurantId();
      const currentRestaurant = validRestaurants.find(
        (r) => r.id === currentRestaurantId
      );

      if (currentRestaurant) {
        setTempSelectedRestaurant(currentRestaurant);
        logger.info(
          `✅ Restaurante atual encontrado na lista: ${currentRestaurant.name}`
        );
      } else {
        logger.info(
          `ℹ️ Restaurante atual (${currentRestaurantId}) não encontrado na lista`
        );
      }
    } catch (error) {
      logger.error("❌ Erro ao carregar restaurantes:", error);
      Alert.alert("Erro", "Não foi possível carregar os restaurantes");
      // Em caso de erro, definir arrays vazios
      setRestaurants([]);
      setFilteredRestaurants([]);
    } finally {
      setIsLoadingRestaurants(false);
    }
  };

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setTempSelectedRestaurant(restaurant);
  };

  const handleTestRestaurant = async () => {
    if (!tempSelectedRestaurant) {
      Alert.alert(
        "Seleção Necessária",
        "Por favor, selecione um restaurante primeiro"
      );
      return;
    }

    setIsLoading(true);

    try {
      logger.info(`🔍 Testando restaurante: ${tempSelectedRestaurant.id}`);
      const restaurant = await restaurantService.getRestaurant(
        tempSelectedRestaurant.id
      );

      Alert.alert(
        "✅ Restaurante Encontrado!",
        `Nome: ${restaurant.name}\nID: ${restaurant.id}\n\nEste restaurante está disponível na API.`
      );
    } catch (error: any) {
      logger.error("❌ Erro ao testar restaurante:", error);

      if (error.response?.status === 404) {
        Alert.alert(
          "❌ Restaurante Não Encontrado",
          `O restaurante "${tempSelectedRestaurant.name}" não foi encontrado na API.`
        );
      } else {
        Alert.alert(
          "❌ Erro de Conexão",
          "Não foi possível conectar com a API. Verifique se a API está rodando."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRestaurant = async () => {
    if (!tempSelectedRestaurant) {
      Alert.alert(
        "Seleção Necessária",
        "Por favor, selecione um restaurante primeiro"
      );
      return;
    }

    setIsSaving(true);

    try {
      const success = await saveSelectedRestaurant(tempSelectedRestaurant);

      if (success) {
        Alert.alert(
          "📋 Restaurante Salvo!",
          `Restaurante "${tempSelectedRestaurant.name}" salvo com sucesso!\n\nO app agora usará este restaurante.`
        );
      } else {
        Alert.alert("Erro", "Não foi possível salvar o restaurante");
      }
    } catch (error) {
      logger.error("❌ Erro ao salvar restaurante:", error);
      Alert.alert("Erro", "Não foi possível salvar o restaurante");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefreshRestaurants = () => {
    setSearchTerm("");
    loadRestaurants();
  };

  return (
    <View style={[styles.card, { margin: 16, padding: 16 }]}>
      <Text
        style={[
          styles.text,
          { fontSize: 18, fontWeight: "600", marginBottom: 16 },
        ]}
      >
        🏪 Configuração do Restaurante
      </Text>

      <Text style={[styles.mutedText, { marginBottom: 16 }]}>
        Selecione um restaurante da sua API:
      </Text>

      {/* Restaurante Atualmente Salvo */}
      {selectedRestaurant && (
        <View
          style={[
            styles.card,
            {
              marginBottom: 16,
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.text,
              {
                color: colors.primaryForeground,
                fontWeight: "600",
                marginBottom: 8,
              },
            ]}
          >
            🏪 Restaurante Atual
          </Text>
          <Text
            style={[
              styles.text,
              { color: colors.primaryForeground, marginBottom: 4 },
            ]}
          >
            {selectedRestaurant.name}
          </Text>
          {selectedRestaurant.address && (
            <Text
              style={[
                styles.mutedText,
                {
                  fontSize: 12,
                  color: colors.primaryForeground,
                  marginBottom: 8,
                },
              ]}
            >
              📍 {formatAddress(selectedRestaurant.address)}
            </Text>
          )}
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: colors.destructive,
                paddingVertical: 8,
                paddingHorizontal: 12,
                alignItems: "center",
                marginTop: 8,
              },
            ]}
            onPress={async () => {
              Alert.alert(
                "Remover Restaurante",
                `Deseja remover o restaurante "${selectedRestaurant.name}"?`,
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Remover",
                    style: "destructive",
                    onPress: async () => {
                      const success = await clearSelectedRestaurant();
                      if (success) {
                        Alert.alert(
                          "Sucesso",
                          "Restaurante removido com sucesso!"
                        );
                      } else {
                        Alert.alert(
                          "Erro",
                          "Não foi possível remover o restaurante"
                        );
                      }
                    },
                  },
                ]
              );
            }}
          >
            <Text
              style={[
                styles.text,
                { color: colors.primaryForeground, fontWeight: "600" },
              ]}
            >
              🗑️ Remover Restaurante
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Campo de Busca */}
      <TextInput
        style={[
          styles.card,
          {
            padding: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.input,
            color: colors.foreground,
          },
        ]}
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Buscar por nome, cidade, estado ou CEP..."
        placeholderTextColor={colors.mutedForeground}
      />

      {/* Lista de Restaurantes */}
      {isLoadingRestaurants ? (
        <View style={{ alignItems: "center", padding: 20 }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.mutedText, { marginTop: 8 }]}>
            Carregando restaurantes...
          </Text>
        </View>
      ) : restaurants.length === 0 ? (
        <View style={{ alignItems: "center", padding: 20 }}>
          <Text style={[styles.mutedText, { textAlign: "center" }]}>
            Nenhum restaurante encontrado na API
          </Text>
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: colors.primary,
                paddingVertical: 8,
                paddingHorizontal: 16,
                marginTop: 12,
                alignItems: "center",
              },
            ]}
            onPress={handleRefreshRestaurants}
          >
            <Text
              style={[
                styles.text,
                { color: colors.primaryForeground, fontWeight: "600" },
              ]}
            >
              🔄 Tentar Novamente
            </Text>
          </TouchableOpacity>
        </View>
      ) : filteredRestaurants.length === 0 ? (
        <View style={{ alignItems: "center", padding: 20 }}>
          <Text style={[styles.mutedText, { textAlign: "center" }]}>
            Nenhum restaurante encontrado com "{searchTerm}"
          </Text>
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: colors.secondary,
                paddingVertical: 8,
                paddingHorizontal: 16,
                marginTop: 12,
                alignItems: "center",
              },
            ]}
            onPress={() => setSearchTerm("")}
          >
            <Text
              style={[
                styles.text,
                { color: colors.secondaryForeground, fontWeight: "600" },
              ]}
            >
              🔍 Limpar Busca
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ marginBottom: 16 }}>
          <ScrollView
            style={{ maxHeight: 300 }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {filteredRestaurants.map((restaurant) => {
              // Validação adicional para garantir que o restaurante tem a estrutura correta
              if (!restaurant || !restaurant.id || !restaurant.name) {
                return null;
              }

              return (
                <TouchableOpacity
                  key={restaurant.id}
                  style={[
                    styles.card,
                    {
                      marginBottom: 8,
                      padding: 12,
                      borderWidth: 2,
                      borderColor:
                        tempSelectedRestaurant?.id === restaurant.id
                          ? colors.primary
                          : colors.border,
                      backgroundColor:
                        tempSelectedRestaurant?.id === restaurant.id
                          ? colors.muted
                          : colors.card,
                    },
                  ]}
                  onPress={() => handleSelectRestaurant(restaurant)}
                >
                  <Text
                    style={[
                      styles.text,
                      { fontWeight: "600", marginBottom: 4 },
                    ]}
                  >
                    {restaurant.name}
                  </Text>
                  {restaurant.address && (
                    <View style={{ marginTop: 4 }}>
                      <Text
                        style={[
                          styles.mutedText,
                          { fontSize: 12, marginBottom: 1 },
                        ]}
                      >
                        📍 {formatAddress(restaurant.address)}
                      </Text>
                      <Text style={[styles.mutedText, { fontSize: 12 }]}>
                        📮 CEP: {formatCEP(restaurant.address.cep)}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Botões de Ação */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TouchableOpacity
          style={[
            styles.card,
            {
              flex: 1,
              backgroundColor: colors.primary,
              paddingVertical: 12,
              alignItems: "center",
            },
          ]}
          onPress={handleTestRestaurant}
          disabled={isLoading || !tempSelectedRestaurant}
        >
          <Text
            style={[
              styles.text,
              { color: colors.primaryForeground, fontWeight: "600" },
            ]}
          >
            {isLoading ? "🔍 Testando..." : "🔍 Testar Restaurante"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            {
              flex: 1,
              backgroundColor: colors.secondary,
              paddingVertical: 12,
              alignItems: "center",
            },
          ]}
          onPress={handleSaveRestaurant}
          disabled={isSaving || !tempSelectedRestaurant}
        >
          <Text
            style={[
              styles.text,
              { color: colors.secondaryForeground, fontWeight: "600" },
            ]}
          >
            {isSaving ? "📋 Salvando..." : "📋 Salvar Restaurante"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Status */}
      {tempSelectedRestaurant && (
        <View
          style={{
            marginTop: 12,
            padding: 12,
            backgroundColor: colors.muted,
            borderRadius: 8,
          }}
        >
          <Text style={[styles.text, { fontWeight: "600", marginBottom: 4 }]}>
            ✅ Restaurante selecionado: {tempSelectedRestaurant.name}
          </Text>
          {tempSelectedRestaurant.address && (
            <Text style={[styles.mutedText, { fontSize: 12 }]}>
              📍 {formatAddress(tempSelectedRestaurant.address)}
            </Text>
          )}
        </View>
      )}

      {/* Informações */}
      <Text
        style={[
          styles.mutedText,
          { fontSize: 10, marginTop: 8, textAlign: "center" },
        ]}
      >
        {restaurants.length} restaurante(s) encontrado(s)
        {searchTerm &&
          ` • ${filteredRestaurants.length} resultado(s) para "${searchTerm}"`}
        {restaurants.length > 5 && (
          <Text style={{ color: colors.primary }}>
            {"\n"}💡 Use a busca para encontrar restaurantes específicos
          </Text>
        )}
      </Text>
    </View>
  );
}
