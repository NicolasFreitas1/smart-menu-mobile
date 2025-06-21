import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Modal } from "react-native";
import { useTheme } from "./theme-provider";
import Icon from "react-native-vector-icons/Feather";

export function ThemeToggle() {
  const { theme, setTheme, colors } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        style={[styles.button, { borderColor: colors.border }]}
      >
        <Icon
          name={theme === "dark" ? "moon" : "sun"}
          size={20}
          color={colors.foreground}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={[
              styles.content,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.option,
                theme === "light" && { backgroundColor: colors.muted },
              ]}
              onPress={() => handleSelect("light")}
            >
              <Icon name="sun" size={20} color={colors.foreground} />
              <Text style={[styles.optionText, { color: colors.foreground }]}>
                Claro
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                theme === "dark" && { backgroundColor: colors.muted },
              ]}
              onPress={() => handleSelect("dark")}
            >
              <Icon name="moon" size={20} color={colors.foreground} />
              <Text style={[styles.optionText, { color: colors.foreground }]}>
                Escuro
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                theme === "system" && { backgroundColor: colors.muted },
              ]}
              onPress={() => handleSelect("system")}
            >
              <Icon name="smartphone" size={20} color={colors.foreground} />
              <Text style={[styles.optionText, { color: colors.foreground }]}>
                Sistema
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "80%",
    maxWidth: 300,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginLeft: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
