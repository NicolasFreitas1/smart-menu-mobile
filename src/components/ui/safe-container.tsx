import React from "react";
import { View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalStyles } from "../../theme/hooks";

interface SafeContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ("top" | "bottom" | "left" | "right")[];
}

export function SafeContainer({
  children,
  style,
  edges = ["top", "left", "right"],
}: SafeContainerProps) {
  const styles = useGlobalStyles();

  return (
    <SafeAreaView style={[styles.screenContainer, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}
