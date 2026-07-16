import { createContext, useContext, useMemo, useState, useEffect, ReactNode } from "react";
import { createTheme, ThemeProvider, useMediaQuery } from "@mui/material";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

interface Props {
  children: ReactNode;
}

export const AutoThemeProvider: React.FC<Props> = ({ children }) => {
  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      setMode(systemPrefersDark ? "dark" : "light");
      setInitialized(true);
    }
  }, [systemPrefersDark, initialized]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                background: {
                  default: "#1a1a2e",
                  paper: "#16213e",
                },
              }
            : {}),
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ isDark: mode === "dark", toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
