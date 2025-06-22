import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";
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
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );
  const [theme, setThemeState] = useState<ThemeType>("system");

  // Listener para mudanças no tema do sistema
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  console.log("[ThemeProvider] systemColorScheme:", systemColorScheme);

  // Carrega o tema salvo ao iniciar
  useEffect(() => {
    loadSavedTheme();
  }, []);

  // Atualiza o tema se o sistema mudar e o tema for 'system'
  useEffect(() => {
    if (theme === "system") {
      setThemeState("system"); // força re-render
    }
  }, [systemColorScheme]);

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
      } else {
        // Se não há tema salvo, usar "system" como padrão
        setThemeState("system");
        await storageService.setTheme("system");
      }
    } catch (error) {
      console.error("Erro ao carregar tema:", error);
      // Em caso de erro, usar "system" como padrão
      setThemeState("system");
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
