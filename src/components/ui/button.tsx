import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
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
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "default",
  size = "default",
  disabled = false,
  style,
  textStyle,
}) => {
  const variantStyle = buttonVariantStyles[variant] || {};
  const sizeStyle = buttonSizeStyles[size] || {};
  const textVariantStyle = buttonTextStyles[variant] || {};

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.buttonBase,
        variantStyle,
        sizeStyle,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.textBase, textVariantStyle, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

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

// 🔵 Variant styles
const buttonVariantStyles: Record<Variant, ViewStyle> = {
  default: {
    backgroundColor: "#2563EB", // bg-primary
  },
  destructive: {
    backgroundColor: "#DC2626",
  },
  outline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  secondary: {
    backgroundColor: "#E5E7EB",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  link: {
    backgroundColor: "transparent",
  },
};

// 🔤 Text styles by variant
const buttonTextStyles: Record<Variant, TextStyle> = {
  default: {
    color: "#fff",
  },
  destructive: {
    color: "#fff",
  },
  outline: {
    color: "#111827",
  },
  secondary: {
    color: "#111827",
  },
  ghost: {
    color: "#111827",
  },
  link: {
    color: "#2563EB",
    textDecorationLine: "underline",
  },
};

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

export default Button;
