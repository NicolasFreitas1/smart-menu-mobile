import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./navigation/AppNavigator";
import { ThemeProvider, useTheme } from "./theme/theme-provider";
import { RestaurantProvider } from "./context/RestaurantContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { databaseService } from "./services/database";
import { getRestaurantId } from "./config/app-config";

function AppContent() {
  const { isDark, colors } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <NavigationContainer
        theme={{
          dark: isDark,
          colors: {
            primary: colors.primary,
            background: colors.background,
            card: colors.card,
            text: colors.foreground,
            border: colors.border,
            notification: colors.destructive,
          },
          fonts: {
            regular: {
              fontFamily: "System",
              fontWeight: "normal",
            },
            medium: {
              fontFamily: "System",
              fontWeight: "500",
            },
            bold: {
              fontFamily: "System",
              fontWeight: "bold",
            },
            heavy: {
              fontFamily: "System",
              fontWeight: "900",
            },
          },
        }}
      >
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [databaseError, setDatabaseError] = useState<string | null>(null);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      await databaseService.init();
      setIsDatabaseReady(true);
      console.log("Aplicação inicializada com sucesso");
    } catch (error) {
      console.error("Erro ao inicializar banco de dados:", error);
      setDatabaseError(
        error instanceof Error ? error.message : "Erro desconhecido"
      );
      // Mesmo com erro no banco, a aplicação pode continuar funcionando
      setIsDatabaseReady(true);
    }
  };

  if (!isDatabaseReady) {
    return null; // Ou um loading screen
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <RestaurantProvider restaurantId={getRestaurantId()}>
              <AppContent />
            </RestaurantProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
