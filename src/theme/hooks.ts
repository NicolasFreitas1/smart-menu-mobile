import { useMemo } from "react";
import { useTheme } from "./theme-provider";
import { createGlobalStyles } from "./styles";

export function useGlobalStyles() {
  const { colors } = useTheme();

  // Memoiza os estilos para evitar recriação desnecessária
  const styles = useMemo(() => createGlobalStyles(colors), [colors]);

  return styles;
}
