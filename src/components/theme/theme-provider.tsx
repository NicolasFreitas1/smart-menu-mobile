import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, ColorSchemeName } from "react-native";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorScheme: ColorSchemeName; // cor atual aplicada
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  colorScheme: Appearance.getColorScheme(),
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  // Atualiza colorScheme com base em theme e preferências do sistema
  const updateColorScheme = (theme: Theme) => {
    if (theme === "system") {
      setColorScheme(Appearance.getColorScheme());
    } else {
      setColorScheme(theme);
    }
  };

  // Carregar tema salvo no AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem(storageKey).then((storedTheme) => {
      if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") {
        setThemeState(storedTheme);
        updateColorScheme(storedTheme);
      } else {
        updateColorScheme(defaultTheme);
      }
    });

    // Escuta mudanças no tema do sistema
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === "system") {
        setColorScheme(colorScheme);
      }
    });

    return () => subscription.remove();
  }, []);

  // Função para setar tema e salvar no AsyncStorage
  const setTheme = (newTheme: Theme) => {
    AsyncStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
    updateColorScheme(newTheme);
  };

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme, colorScheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
