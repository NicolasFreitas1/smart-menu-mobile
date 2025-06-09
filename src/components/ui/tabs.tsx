import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

function Tabs({ children, style }) {
  return <View style={[styles.tabs, style]}>{children}</View>;
}

function TabsList({ children, style }) {
  return <View style={[styles.tabsList, style]}>{children}</View>;
}

function TabsTrigger({ children, onPress, active, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tabTrigger, active && styles.activeTrigger, style]}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, active && styles.activeTabText]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

function TabsContent({ children, active, style }) {
  if (!active) return null;
  return <View style={[styles.tabsContent, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "column",
    gap: 8, // gap não funciona no RN, pode usar margin
  },
  tabsList: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    padding: 3,
    alignSelf: "flex-start",
  },
  tabTrigger: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  activeTrigger: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#000",
  },
  tabsContent: {
    marginTop: 8,
  },
});

export { Tabs, TabsList, TabsTrigger, TabsContent };
