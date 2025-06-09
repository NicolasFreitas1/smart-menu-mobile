import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CardProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ style, children }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

export const CardHeader: React.FC<CardProps> = ({ style, children }) => {
  return <View style={[styles.cardHeader, style]}>{children}</View>;
};

export const CardTitle: React.FC<{ style?: TextStyle; children?: React.ReactNode }> = ({
  style,
  children,
}) => {
  return <Text style={[styles.cardTitle, style]}>{children}</Text>;
};

export const CardDescription: React.FC<{ style?: TextStyle; children?: React.ReactNode }> = ({
  style,
  children,
}) => {
  return <Text style={[styles.cardDescription, style]}>{children}</Text>;
};

export const CardAction: React.FC<CardProps> = ({ style, children }) => {
  return <View style={[styles.cardAction, style]}>{children}</View>;
};

export const CardContent: React.FC<CardProps> = ({ style, children }) => {
  return <View style={[styles.cardContent, style]}>{children}</View>;
};

export const CardFooter: React.FC<CardProps> = ({ style, children }) => {
  return <View style={[styles.cardFooter, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    paddingVertical: 24,
    flexDirection: 'column',
    gap: 24,
  },
  cardHeader: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 4,
    color: '#111827',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  cardAction: {
    alignSelf: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  cardContent: {
    paddingHorizontal: 24,
  },
  cardFooter: {
    paddingHorizontal: 24,
    paddingTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
