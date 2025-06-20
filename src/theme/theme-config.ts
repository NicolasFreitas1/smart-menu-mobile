export type ThemeType = "light" | "dark" | "system";

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  radius: number;
}

export const themeColors = {
  light: {
    background: "#FFFFFF",
    foreground: "#24243A",
    card: "#FFFFFF",
    cardForeground: "#24243A",
    popover: "#FFFFFF",
    popoverForeground: "#24243A",
    primary: "#48BB78",
    primaryForeground: "#FFFFFF",
    secondary: "#F7E8FF",
    secondaryForeground: "#36364A",
    muted: "#F7E8FF",
    mutedForeground: "#8A8AB8",
    accent: "#F7E8FF",
    accentForeground: "#36364A",
    destructive: "#E4572E",
    border: "#EBEBF5",
    input: "#EBEBF5",
    radius: 8,
  },
  dark: {
    background: "#000",
    foreground: "#FCFCFC",
    card: "#121212",
    cardForeground: "#FCFCFC",
    popover: "#121212",
    popoverForeground: "#FCFCFC",
    primary: "#48BB78",
    primaryForeground: "#FFFFFF",
    secondary: "#1E1E1E",
    secondaryForeground: "#FCFCFC",
    muted: "#1E1E1E",
    mutedForeground: "#A0A0A0",
    accent: "#1E1E1E",
    accentForeground: "#FCFCFC",
    destructive: "#E4572E",
    border: "rgba(255,255,255,0.1)",
    input: "rgba(255,255,255,0.15)",
    radius: 8,
  },
} as const;
