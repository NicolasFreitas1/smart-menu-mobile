import React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({
  variant = 'default',
  children,
  style,
  textStyle,
}: BadgeProps) {
  return (
    <View style={[styles.base, variantStyles[variant], style]}>
      <Text style={[styles.text, textVariantStyles[variant], textStyle]}>
        {children}
      </Text>
    </View>
  );
}

// Base styles
const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});

// Variants
const variantStyles: Record<BadgeVariant, ViewStyle> = {
  default: {
    backgroundColor: '#6366f1', // bg-primary
  },
  secondary: {
    backgroundColor: '#e5e7eb', // bg-secondary
  },
  destructive: {
    backgroundColor: '#ef4444', // bg-destructive
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#9ca3af', // outline border
  },
};

const textVariantStyles: Record<BadgeVariant, TextStyle> = {
  default: {
    color: '#ffffff', // text-primary-foreground
  },
  secondary: {
    color: '#111827', // text-secondary-foreground
  },
  destructive: {
    color: '#ffffff',
  },
  outline: {
    color: '#111827',
  },
};
