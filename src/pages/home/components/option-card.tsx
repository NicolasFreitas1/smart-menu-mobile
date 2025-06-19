import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../theme/theme-provider";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

interface OptionCardProps {
  title: string;
  redirectTo: string;
  icon: string;
}

export function OptionCard({ redirectTo, title, icon }: OptionCardProps) {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(redirectTo as never)}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Icon name={icon} size={20} color={colors.mutedForeground} />
      <Text
        style={[
          styles.title,
          {
            color: colors.mutedForeground,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
});
