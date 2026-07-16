import { Typography, Box, IconButton, Tooltip, useTheme } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "./AutoThemeProvider";

const Head: React.FC = () => {
  const { spacing } = useTheme();
  const { isDark, toggleTheme } = useThemeMode();

  return (
    <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="h1"
          sx={{ fontSize: spacing(2.875), mb: spacing(0.5) }}
        >
          Tachometer
        </Typography>
        <Box>Shows real-time cpu and memory usage of containers</Box>
      </Box>
      <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
        <IconButton onClick={toggleTheme} size="small">
          {isDark ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Head;
