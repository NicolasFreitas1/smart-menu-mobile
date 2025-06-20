import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance, ColorSchemeName, useColorScheme } from "react-native";
import { ThemeType, ThemeColors, themeColors } from "./theme-config";
import { storageService } from "../services/storage";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>("system");

  // Carrega o tema salvo ao iniciar
  useEffect(() => {
    loadSavedTheme();
  }, []);

  // Carrega o tema salvo no AsyncStorage
  const loadSavedTheme = async () => {
    try {
      const savedTheme = await storageService.getTheme();
      if (
        savedTheme &&
        (savedTheme === "light" ||
          savedTheme === "dark" ||
          savedTheme === "system")
      ) {
        setThemeState(savedTheme as ThemeType);
      }
    } catch (error) {
      console.error("Erro ao carregar tema:", error);
    }
  };

  // Salva o tema no AsyncStorage
  const setTheme = async (newTheme: ThemeType) => {
    try {
      await storageService.setTheme(newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error("Erro ao salvar tema:", error);
    }
  };

  // Determina se está no modo escuro
  const isDark =
    theme === "system" ? systemColorScheme === "dark" : theme === "dark";

  // Pega as cores do tema atual
  const colors = isDark ? themeColors.dark : themeColors.light;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
}
