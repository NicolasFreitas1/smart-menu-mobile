import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from "react-native";

type Variant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
type Size = "default" | "sm" | "lg" | "icon";

interface ButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "default",
  size = "default",
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.buttonBase, disabled && styles.disabled, style]}
    >
      <Text style={[styles.textBase, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

function getButtonVariantStyle(variant: Variant, colors: any): ViewStyle {
  switch (variant) {
    case "default":
      return { backgroundColor: colors.primary };
    case "destructive":
      return { backgroundColor: colors.destructive };
    case "outline":
      return {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
      };
    case "secondary":
      return { backgroundColor: colors.secondary };
    case "ghost":
      return { backgroundColor: "transparent" };
    case "link":
      return { backgroundColor: "transparent" };
    default:
      return {};
  }
}

function getButtonTextStyle(variant: Variant, colors: any): TextStyle {
  switch (variant) {
    case "default":
      return { color: colors.primaryForeground };
    case "destructive":
      return { color: colors.primaryForeground };
    case "outline":
      return { color: colors.foreground };
    case "secondary":
      return { color: colors.foreground };
    case "ghost":
      return { color: colors.foreground };
    case "link":
      return { color: colors.primary, textDecorationLine: "underline" };
    default:
      return {};
  }
}

const styles = StyleSheet.create({
  buttonBase: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  textBase: {
    fontSize: 14,
    fontWeight: "500",
  },
  disabled: {
    opacity: 0.5,
  },
});

// 📐 Size styles
const buttonSizeStyles: Record<Size, ViewStyle> = {
  default: {
    height: 40,
    paddingHorizontal: 16,
  },
  sm: {
    height: 32,
    paddingHorizontal: 12,
  },
  lg: {
    height: 48,
    paddingHorizontal: 24,
  },
  icon: {
    height: 40,
    width: 40,
    paddingHorizontal: 0,
  },
};
