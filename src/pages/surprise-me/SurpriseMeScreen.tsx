import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import { restaurantService } from "../../services/restaurant";
import { CategoryFilter } from "../../components/ui/category-filter";
import { DishItem } from "../../components/dish-item";
import { Button } from "../../components/ui/button";
import { useRestaurant } from "../../context/RestaurantContext";
import { Dish } from "../../domain/dish";
import { Category } from "../../domain/category";
import { useGlobalStyles } from "../../theme/hooks";
import { getRestaurantId } from "../../config/app-config";

export function SurpriseMeScreen() {
  const { restaurant } = useRestaurant();
  const styles = useGlobalStyles();

  const [categories, setCategories] = useState<Category[]>([]);
  const [randomDish, setRandomDish] = useState<Dish | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const fetchCategories = useCallback(async () => {
    try {
      const result = await restaurantService.getCategories();
      setCategories(result);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      Alert.alert("Erro", "Não foi possível carregar as categorias");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === "Todas" ? "" : category);
  };

  const handleNextStep = async () => {
    try {
      const restaurantId = restaurant?.id || getRestaurantId();

      if (!restaurantId) {
        Alert.alert("Erro", "Restaurante não encontrado");
        return;
      }

      if (!selectedCategory) {
        Alert.alert("Erro", "Selecione uma categoria");
        return;
      }

      setIsLoading(true);

      const dishes = await restaurantService.getDishes(restaurantId, {
        categories: [selectedCategory],
        priceRange: { min: 0, max: 1000 },
        dietaryRestrictions: [],
        sortBy: "name",
        showFavoritesOnly: false,
      });

      if (dishes.length === 0) {
        Alert.alert(
          "Erro",
          "Nenhum prato encontrado com a categoria selecionada!"
        );
        return;
      }

      // Escolher um prato aleatório
      const random = dishes[Math.floor(Math.random() * dishes.length)];
      setRandomDish(random);
      setStep(2);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Erro",
        "Nenhum prato encontrado com a categoria selecionada!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedCategory("");
    setRandomDish(null);
    setStep(1);
  };

  const categoryNames = categories.map((cat) => cat.name);

  return (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={{
        padding: 24,
        paddingTop: 40,
        alignItems: "center",
      }}
    >
      {step === 1 && (
        <View style={{ width: "100%", alignItems: "center", gap: 24 }}>
          <View style={{ alignItems: "center", gap: 8 }}>
            <Text style={[styles.text, { fontSize: 24, fontWeight: "700" }]}>
              Surpreenda-me
            </Text>
            <Text style={[styles.mutedText, { textAlign: "center" }]}>
              Escolha uma categoria e descubra um prato aleatório!
            </Text>
          </View>

          <View style={{ width: "100%" }}>
            <CategoryFilter
              categories={categoryNames}
              onSelect={handleCategoryFilter}
              selected={selectedCategory || "Todas"}
              showAll={true}
            />
          </View>

          <Button
            title={isLoading ? "Pensando..." : "Próximo"}
            onPress={handleNextStep}
            disabled={!selectedCategory || isLoading}
            style={{ minWidth: 120 }}
          />

          {isLoading && <ActivityIndicator size="small" color="#48BB78" />}
        </View>
      )}

      {step === 2 && randomDish && (
        <View style={{ width: "100%", alignItems: "center", gap: 24 }}>
          <Text style={[styles.text, { fontSize: 20, fontWeight: "700" }]}>
            Você foi surpreendido com:
          </Text>

          <DishItem
            id={randomDish.id}
            name={randomDish.name}
            description={randomDish.description}
            price={randomDish.price}
          />

          <Button
            title="Tentar novamente"
            onPress={handleReset}
            variant="outline"
            style={{ minWidth: 120 }}
          />
        </View>
      )}
    </ScrollView>
  );
}
