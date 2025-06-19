import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../theme/theme-provider";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

interface CartResumeProps {
  totalItems: number;
  totalPrice: number;
}

export function CartResume({ totalItems, totalPrice }: CartResumeProps) {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Cart" as never)}
      style={[
        styles.container,
        {
          backgroundColor: colors.primary,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.primaryForeground,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: colors.primary,
                },
              ]}
            >
              {totalItems}
            </Text>
          </View>
          <Text
            style={[
              styles.text,
              {
                color: colors.primaryForeground,
              },
            ]}
          >
            Ver carrinho
          </Text>
        </View>

        <View style={styles.rightContent}>
          <Text
            style={[
              styles.price,
              {
                color: colors.primaryForeground,
              },
            ]}
          >
            {totalPrice.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
          <Icon
            name="chevron-right"
            size={20}
            color={colors.primaryForeground}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    borderRadius: 999,
    padding: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
  price: {
    fontSize: 14,
    fontWeight: "500",
  },
});
