import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";

interface SeparatorProps extends ViewProps {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean; // não costuma ser usado no RN, mas mantém se quiser
}

function Separator({
  orientation = "horizontal",
  decorative = true,
  style,
  ...props
}: SeparatorProps) {
  return (
    <View
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? "no-hide-descendants" : "auto"}
      style={[
        orientation === "horizontal" ? styles.horizontal : styles.vertical,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    width: "100%",
    backgroundColor: "#ccc", // ajuste para sua cor de borda
  },
  vertical: {
    width: 1,
    height: "100%",
    backgroundColor: "#ccc",
  },
});

export { Separator };
