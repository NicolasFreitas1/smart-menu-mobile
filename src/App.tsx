import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./navigation/AppNavigator";
import { ThemeProvider, useTheme } from "./theme/theme-provider";
import { RestaurantProvider } from "./context/RestaurantContext";
import { CartProvider } from "./context/CartContext";

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
  const restaurantId = "4a94dbcc-b9b7-470c-9a47-c61062f66579";

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RestaurantProvider restaurantId={restaurantId}>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </RestaurantProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
