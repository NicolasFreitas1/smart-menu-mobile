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
      activeOpacity={0.7}
    >
      <Icon name={icon} size={24} color={colors.primary} />
      <Text
        style={[
          styles.title,
          {
            color: colors.foreground,
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
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
    minHeight: 60,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    flex: 1,
  },
});
