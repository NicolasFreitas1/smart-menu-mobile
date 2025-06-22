import React from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useTheme } from "../../theme/theme-provider";
import { ThemeToggle } from "../../theme/theme-toggle";

interface HomeHeaderProps {
  onSettingsPress: () => void;
}

export function HomeHeader({ onSettingsPress }: HomeHeaderProps) {
  const { colors } = useTheme();

  const handleSettingsPress = () => {
    console.log("Settings button pressed in header");
    try {
      onSettingsPress();
    } catch (error) {
      console.error("Error in settings press:", error);
      Alert.alert("Erro", "Não foi possível abrir as configurações");
    }
  };

  return (
    <View style={localStyles.header}>
      <TouchableOpacity
        style={[localStyles.settingsButton, { backgroundColor: colors.card }]}
        onPress={handleSettingsPress}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather name="settings" size={24} color={colors.foreground} />
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    zIndex: 10,
  },
  settingsButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
