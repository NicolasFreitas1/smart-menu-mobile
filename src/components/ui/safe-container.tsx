import React from "react";
import { View, ViewStyle, Platform } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useGlobalStyles } from "../../theme/hooks";

interface SafeContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ("top" | "bottom" | "left" | "right")[];
  considerTabBar?: boolean;
  considerNavigationBar?: boolean;
}

export function SafeContainer({
  children,
  style,
  edges = ["top", "left", "right"],
  considerTabBar = false,
  considerNavigationBar = true,
}: SafeContainerProps) {
  const styles = useGlobalStyles();
  const insets = useSafeAreaInsets();

  // Adicionar padding bottom para navigation bar no Android
  const navigationBarPadding =
    Platform.OS === "android" && considerNavigationBar
      ? { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }
      : {};

  const containerStyle = considerTabBar
    ? [
        styles.screenContainer,
        { paddingBottom: 0 },
        navigationBarPadding,
        style,
      ]
    : [styles.screenContainer, navigationBarPadding, style];

  return (
    <SafeAreaView style={containerStyle} edges={edges}>
      {children}
    </SafeAreaView>
  );
}
