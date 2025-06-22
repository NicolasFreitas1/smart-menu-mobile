import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MainNavigator } from "./navigation/MainNavigator";
import { ThemeProvider, useTheme } from "./theme/theme-provider";
import { RestaurantProvider } from "./context/RestaurantContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { pushNotificationService } from "./services/push-notifications";
import { offlineSyncService } from "./services/offline-sync";
import {
  cleanupStorage,
  cleanupCorruptedReservations,
} from "./utils/storage-cleanup";
import { useAppInitialization } from "./hooks/use-app-initialization";

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
        <MainNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { isInitialized } = useAppInitialization();

  useEffect(() => {
    const initializeServices = async () => {
      try {
        console.log("🚀 Iniciando Smart Menu Mobile...");

        // Limpeza do storage para resolver problemas de JSON corrompido
        console.log("🧹 Verificando e limpando storage...");
        await cleanupStorage();

        // Limpeza específica de reservas corrompidas
        console.log("📅 Verificando dados de reservas...");
        await cleanupCorruptedReservations();

        // Inicializar serviços
        console.log("🔧 Inicializando serviços...");
        await Promise.all([
          offlineSyncService.initialize(),
          pushNotificationService.initialize(),
        ]);

        console.log("✅ Aplicação inicializada com sucesso!");
      } catch (error) {
        console.error("❌ Erro na inicialização:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeServices();
  }, []);

  if (isLoading || !isInitialized) {
    return null; // Tela de loading pode ser adicionada aqui
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RestaurantProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </RestaurantProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
