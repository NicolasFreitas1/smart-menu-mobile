import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useTheme } from "../../theme/theme-provider";
import { ThemeToggle } from "../../theme/theme-toggle";

interface HomeHeaderProps {
  onSettingsPress: () => void;
}

export function HomeHeader({ onSettingsPress }: HomeHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={localStyles.header}>
      <TouchableOpacity
        style={localStyles.settingsButton}
        onPress={onSettingsPress}
      >
        <Feather name="settings" size={24} color={colors.mutedForeground} />
      </TouchableOpacity>
      <ThemeToggle />
    </View>
  );
}

const localStyles = StyleSheet.create({
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
});
