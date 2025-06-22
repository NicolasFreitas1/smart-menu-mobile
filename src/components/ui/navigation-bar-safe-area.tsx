import React from "react";
import { View, ViewStyle, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface NavigationBarSafeAreaProps {
  children: React.ReactNode;
  style?: ViewStyle;
  enabled?: boolean;
}

export function NavigationBarSafeArea({
  children,
  style,
  enabled = true,
}: NavigationBarSafeAreaProps) {
  const insets = useSafeAreaInsets();

  if (!enabled || Platform.OS !== "android") {
    return <View style={style}>{children}</View>;
  }

  const navigationBarPadding = {
    paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
  };

  return <View style={[style, navigationBarPadding]}>{children}</View>;
}
