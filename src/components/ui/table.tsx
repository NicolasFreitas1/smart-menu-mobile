import * as React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

function Table({ style, children, ...props }) {
  // Container com scroll horizontal
  return (
    <ScrollView
      horizontal
      style={[styles.container, style]}
      {...props}
    >
      <View>{children}</View>
    </ScrollView>
  );
}

function TableHeader({ style, children, ...props }) {
  return (
    <View style={[styles.header, style]} {...props}>
      {children}
    </View>
  );
}

function TableBody({ style, children, ...props }) {
  return (
    <View style={[styles.body, style]} {...props}>
      {children}
    </View>
  );
}

function TableFooter({ style, children, ...props }) {
  return (
    <View style={[styles.footer, style]} {...props}>
      {children}
    </View>
  );
}

function TableRow({ style, children, ...props }) {
  return (
    <View style={[styles.row, style]} {...props}>
      {children}
    </View>
  );
}

function TableHead({ style, children, ...props }) {
  return (
    <View style={[styles.headCell, style]} {...props}>
      <Text style={styles.headText}>{children}</Text>
    </View>
  );
}

function TableCell({ style, children, ...props }) {
  return (
    <View style={[styles.cell, style]} {...props}>
      <Text>{children}</Text>
    </View>
  );
}

function TableCaption({ style, children, ...props }) {
  return (
    <Text style={[styles.caption, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  body: {},
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#eee",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headCell: {
    flex: 1,
    padding: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
  },
  headText: {
    fontWeight: "bold",
  },
  cell: {
    flex: 1,
    padding: 8,
    justifyContent: "center",
  },
  caption: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
  },
});

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
