import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useTheme } from "../../theme/theme-provider";
import { useRestaurant } from "../../context/RestaurantContext";
import { useCart } from "../../context/CartContext";
import { OptionCard } from "./components/option-card";
import { CartResume } from "../../components/cart-resume";
import { ThemeToggle } from "../../theme/theme-toggle";
import { SafeContainer } from "../../components/ui/safe-container";

export function HomeScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { restaurant, isLoading } = useRestaurant();
  const { totalItems, totalPrice, hasItems } = useCart();

  const handleSettingsPress = () => {
    // Aqui você pode navegar para a tela de configurações
    // navigation.navigate('Settings');
    console.log("Navegar para configurações");
  };

  if (isLoading) {
    return (
      <SafeContainer style={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettingsPress}
        >
          <Feather name="settings" size={24} color={colors.mutedForeground} />
        </TouchableOpacity>
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
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  settingsButton: {
    padding: 8,
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
