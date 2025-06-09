import React from "react";
import { ScrollView, StyleSheet, View, ViewProps } from "react-native";

interface ScrollAreaProps extends ViewProps {
  children: React.ReactNode;
  horizontal?: boolean;
}

function ScrollArea({ style, children, horizontal = false, ...props }: ScrollAreaProps) {
  return (
    <ScrollView
      style={[styles.scrollArea, style]}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={true}
      showsVerticalScrollIndicator={true}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollArea: {
    flex: 1,
  },
});

export { ScrollArea };
