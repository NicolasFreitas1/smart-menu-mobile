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
  const variantStyle = getButtonVariantStyle(variant);
  const variantTextStyle = getButtonTextStyle(variant);
  const sizeStyle = buttonSizeStyles[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.buttonBase,
        sizeStyle,
        variantStyle,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.textBase, variantTextStyle, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

function getButtonVariantStyle(variant: Variant): ViewStyle {
  switch (variant) {
    case "default":
      return { backgroundColor: "#48BB78" };
    case "destructive":
      return { backgroundColor: "#E53E3E" };
    case "outline":
      return {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#E2E8F0",
      };
    case "secondary":
      return { backgroundColor: "#F7FAFC" };
    case "ghost":
      return { backgroundColor: "transparent" };
    case "link":
      return { backgroundColor: "transparent" };
    default:
      return {};
  }
}

function getButtonTextStyle(variant: Variant): TextStyle {
  switch (variant) {
    case "default":
      return { color: "#FFFFFF" };
    case "destructive":
      return { color: "#FFFFFF" };
    case "outline":
      return { color: "#2D3748" };
    case "secondary":
      return { color: "#2D3748" };
    case "ghost":
      return { color: "#2D3748" };
    case "link":
      return { color: "#48BB78", textDecorationLine: "underline" };
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
