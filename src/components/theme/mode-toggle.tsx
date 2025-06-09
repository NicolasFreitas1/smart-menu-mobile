import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/components/theme/theme-provider";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  function handleSelect(theme: "light" | "dark" | "system") {
    setTheme(theme);
    setModalVisible(false);
  }

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Alterar tema"
      >
        {/* Ícone alternativo para Sol/Lua */}
        <Text style={styles.icon}>🌞🌜</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => handleSelect("light")}
            >
              <Text>Claro</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => handleSelect("dark")}
            >
              <Text>Escuro</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => handleSelect("system")}
            >
              <Text>Sistema</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  icon: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 20,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
});
