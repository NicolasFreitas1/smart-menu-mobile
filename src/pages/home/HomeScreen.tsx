import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "../../theme/theme-provider";
import { useRestaurant } from "../../context/RestaurantContext";
import { useCart } from "../../context/CartContext";
import { OptionCard } from "./components/option-card";
import { CartResume } from "../../components/cart-resume";
import { ThemeToggle } from "../../theme/theme-toggle";

export function HomeScreen() {
  const { colors } = useTheme();
  const { restaurant, isLoading } = useRestaurant();
  const { totalItems, totalPrice, hasItems } = useCart();

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <ThemeToggle />
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: colors.foreground,
            },
          ]}
        >
          Olá, bem-vindo ao {restaurant?.name}
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.mutedForeground,
            },
          ]}
        >
          Escolha uma das opções abaixo para começar seu pedido ou explorar o
          cardápio.
        </Text>

        <View style={styles.optionsContainer}>
          <OptionCard title="Surpreenda-me" redirectTo="Surprise" icon="zap" />
          <OptionCard
            title="Sugestão"
            redirectTo="Assistant"
            icon="message-square"
          />
          <OptionCard title="Cardápio" redirectTo="Menu" icon="book-open" />
        </View>
      </View>

      {hasItems && (
        <CartResume totalItems={totalItems} totalPrice={totalPrice} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  optionsContainer: {
    width: "100%",
    maxWidth: 320,
    gap: 12,
  },
});
