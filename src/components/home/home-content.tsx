import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../../theme/theme-provider";
import { OptionCard } from "../../pages/home/components/option-card";
import { Restaurant } from "../../domain/restaurant";

interface HomeContentProps {
  restaurant: Restaurant | undefined;
}

export function HomeContent({ restaurant }: HomeContentProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={localStyles.scrollView}
      contentContainerStyle={localStyles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={localStyles.content}>
        <Text
          style={[
            localStyles.title,
            {
              color: colors.foreground,
            },
          ]}
        >
          Olá, bem-vindo ao {restaurant?.name}
        </Text>

        <Text
          style={[
            localStyles.subtitle,
            {
              color: colors.mutedForeground,
            },
          ]}
        >
          Escolha uma das opções abaixo para começar seu pedido ou explorar o
          cardápio.
        </Text>

        <View style={localStyles.optionsContainer}>
          <OptionCard title="Surpreenda-me" redirectTo="Surprise" icon="zap" />
          <OptionCard
            title="Sugestão"
            redirectTo="Assistant"
            icon="message-square"
          />
          <OptionCard title="Cardápio" redirectTo="Menu" icon="book-open" />
          <OptionCard
            title="Reservas"
            redirectTo="Reservations"
            icon="calendar"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120, // Espaço extra para o cart resume
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 500, // Altura mínima para garantir que o conteúdo seja visível
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 24,
    lineHeight: 24,
  },
  optionsContainer: {
    width: "100%",
    maxWidth: 320,
    marginVertical: 6,
  },
});
