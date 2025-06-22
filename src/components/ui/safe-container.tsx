import React from "react";
import { View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalStyles } from "../../theme/hooks";

interface SafeContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ("top" | "bottom" | "left" | "right")[];
  considerTabBar?: boolean;
}

export function SafeContainer({
  children,
  style,
  edges = ["top", "left", "right"],
  considerTabBar = false,
}: SafeContainerProps) {
  const styles = useGlobalStyles();

  const containerStyle = considerTabBar
    ? [styles.screenContainer, { paddingBottom: 0 }, style]
    : [styles.screenContainer, style];

  return (
    <SafeAreaView style={containerStyle} edges={edges}>
      {children}
    </SafeAreaView>
  );
}
