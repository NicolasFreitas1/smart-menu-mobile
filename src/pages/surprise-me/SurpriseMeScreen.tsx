import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import {
  getCategories,
  getRandomDishFromRestaurant,
} from "../../services/restaurant";
import { CategoryFilter } from "../../components/ui/category-filter";
import { DishItem } from "../../components/dish-item";
import { Button } from "../../components/ui/button";
import { useRestaurant } from "../../context/RestaurantContext";
import { Dish } from "../../domain/dish";
import { Category } from "../../domain/category";
import { useGlobalStyles } from "../../theme/hooks";

export function SurpriseMeScreen() {
  const { restaurantId } = useRestaurant();
  const styles = useGlobalStyles();

  const [categories, setCategories] = useState<Category[]>([]);
  const [randomDish, setRandomDish] = useState<Dish | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const fetchCategories = useCallback(async () => {
    try {
      const result = await getCategories();
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
      if (!restaurantId) {
        Alert.alert("Erro", "Restaurante não encontrado");
        return;
      }

      if (!selectedCategory) {
        Alert.alert("Erro", "Selecione uma categoria");
        return;
      }

      setIsLoading(true);

      const random = await getRandomDishFromRestaurant({
        restaurantId,
        category: selectedCategory,
      });
      setRandomDish(random.dish);
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
      style={[styles.screenContainer, { padding: 24, paddingTop: 40 }]}
      contentContainerStyle={{ alignItems: "center" }}
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

          <DishItem {...randomDish} />

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
