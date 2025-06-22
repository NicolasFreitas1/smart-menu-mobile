import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "../../theme/theme-provider";
import { useHome } from "../../hooks/use-home";
import { HomeHeader } from "../../components/home/home-header";
import { HomeContent } from "../../components/home/home-content";
import { CartResume } from "../../components/cart-resume";
import { SafeContainer } from "../../components/ui/safe-container";

export function HomeScreen({ navigation }: any) {
  const { colors } = useTheme();
  const {
    restaurant,
    isLoading,
    totalItems,
    totalPrice,
    hasItems,
    handleSettingsPress,
  } = useHome();

  if (isLoading) {
    return (
      <SafeContainer style={localStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <HomeHeader onSettingsPress={handleSettingsPress} />
      <HomeContent restaurant={restaurant} />
      {hasItems && (
        <CartResume totalItems={totalItems} totalPrice={totalPrice} />
      )}
    </SafeContainer>
  );
}

const localStyles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
