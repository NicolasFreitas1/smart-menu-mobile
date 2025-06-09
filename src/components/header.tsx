import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { ModeToggle } from "./theme/mode-toggle";

export function Header() {
  const navigation = useNavigation();
  const route = useRoute();

  // Rota atual
  const currentRouteName = route.name;

  // Mapeamento das rotas para labels e rotas de navegação
  const links = [
    { label: "Usuário", routeName: "User" },
    { label: "Cardápio", routeName: "Menu" },
    { label: "Pedidos", routeName: "Orders" },
  ];

  return (
    <View style={styles.nav}>
      {/* ESQUERDA */}
      <View style={styles.left}>
        {links.map(({ label, routeName }) => {
          const isActive = currentRouteName === routeName;
          return (
            <TouchableOpacity
              key={routeName}
              onPress={() => navigation.navigate(routeName as never)}
              style={styles.linkContainer}
              activeOpacity={0.7}
            >
              <Text style={[styles.linkText, isActive ? styles.activeLink : styles.inactiveLink]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* DIREITA */}
      <View style={styles.right}>
        <ModeToggle />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    gap: 24, // RN não suporta gap, então substitua por marginRight abaixo
  },
  linkContainer: {
    marginRight: 24, // para simular gap
  },
  linkText: {
    fontSize: 16,
  },
  activeLink: {
    fontWeight: "700",
    color: "#16a34a", // verde (text-primary)
  },
  inactiveLink: {
    color: "#6b7280", // cinza (text-muted-foreground)
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    // largura fixa não muito comum no RN, se quiser limitar pode usar maxWidth
    maxWidth: 250,
    padding: 4,
  },
});
