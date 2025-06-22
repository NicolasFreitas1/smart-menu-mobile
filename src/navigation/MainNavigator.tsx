import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View, Text } from "react-native";
import { useAppInitialization } from "../hooks/use-app-initialization";
import { RestaurantSelectionScreen } from "../pages/restaurant-selection/RestaurantSelectionScreen";
import { AppNavigator } from "./AppNavigator";
import { useTheme } from "../theme/theme-provider";

const Stack = createStackNavigator();

export function MainNavigator() {
  const { isInitialized, hasSelectedRestaurant } = useAppInitialization();
  const { colors } = useTheme();

  // Tela de loading durante a inicialização
  if (!isInitialized) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 16, color: colors.foreground, fontSize: 16 }}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {hasSelectedRestaurant ? (
        // Se há restaurante selecionado, mostrar o app principal
        <Stack.Screen name="MainApp" component={AppNavigator} />
      ) : (
        // Se não há restaurante selecionado, mostrar tela de seleção
        <Stack.Screen
          name="RestaurantSelection"
          component={RestaurantSelectionScreen}
        />
      )}
    </Stack.Navigator>
  );
}
