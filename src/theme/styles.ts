import { StyleSheet } from "react-native";
import { ThemeColors } from "./theme-config";

export const createGlobalStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // Containers
    screenContainer: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
      paddingBottom: 80,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },

    // Headers e Títulos
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingVertical: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.foreground,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: 8,
    },

    // Textos
    text: {
      color: colors.foreground,
      fontSize: 16,
    },
    mutedText: {
      color: colors.mutedForeground,
      fontSize: 14,
    },

    // Inputs
    input: {
      backgroundColor: colors.input,
      borderRadius: 8,
      padding: 12,
      color: colors.foreground,
      borderWidth: 1,
      borderColor: colors.border,
    },

    // Listas
    list: {
      gap: 12,
    },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },

    // Botões
    buttonPrimary: {
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonSecondary: {
      backgroundColor: colors.secondary,
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonText: {
      color: colors.primaryForeground,
      fontSize: 16,
      fontWeight: "600",
    },
    buttonTextSecondary: {
      color: colors.secondaryForeground,
      fontSize: 16,
      fontWeight: "600",
    },

    // Divisores
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
    },

    // Badges
    badge: {
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    badgeText: {
      color: colors.primaryForeground,
      fontSize: 12,
      fontWeight: "500",
    },
  });
